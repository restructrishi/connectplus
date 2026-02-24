import { differenceInMinutes } from "date-fns";
import { prisma } from "../../prisma";
import { mailer } from "../../utils/mailer";
import { pipelineSync } from "../../utils/pipelineSync";
import { notificationService } from "../notifications/service";
import { deploymentService } from "../deployment/service";

async function logScmActivity(orderId: string, type: string, description: string, userId: number | null, extra?: { fileUrl?: string | null }) {
  const createdBy = userId != null ? String(userId) : "system";

  await prisma.sCMActivity.create({
    data: {
      orderId,
      type,
      description,
      createdBy,
      fileUrl: extra?.fileUrl ?? null,
    },
  });
}

async function getRoleEmails(roleName: string) {
  const users = await prisma.user.findMany({
    where: {
      role: {
        name: roleName,
      },
      isActive: true,
    },
    select: {
      email: true,
    },
  });

  return users.map(user => user.email).filter(email => email && email.length > 0);
}

type InitializeOrderParams = {
  ovfId: number;
  dealId: number;
  leadId: number;
  userId: number | null;
};

type ListOrdersParams = {
  page: number;
  pageSize: number;
  role: string;
  userId: number;
  stage?: string | null;
  status?: string | null;
  assignedTo?: string | null;
};

export const scmService = {
  async initializeOrder(params: InitializeOrderParams) {
    const { ovfId, dealId, leadId, userId } = params;

    const existing = await prisma.sCMOrder.findFirst({
      where: {
        linkedOVFId: String(ovfId),
      },
    });

    if (existing) {
      return existing;
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: dealId,
      },
    });

    const clientName = lead?.companyName ?? opportunity?.companyName ?? "Unknown client";
    const clientAddress = [lead?.city, lead?.state].filter(Boolean).join(", ") || null;

    const scmUser = await prisma.user.findFirst({
      where: {
        role: {
          name: "SCM",
        },
      },
      include: {
        role: true,
      },
    });

    const assignedTo = scmUser?.name ?? "SCM_TEAM_LEAD";

    const order = await prisma.sCMOrder.create({
      data: {
        orderRef: `SCM-${Date.now()}`,
        linkedLeadId: String(leadId),
        linkedDealId: String(dealId),
        linkedOVFId: String(ovfId),
        linkedPOId: opportunity ? String(opportunity.id) : null,
        clientName,
        clientAddress,
        assignedTo,
        currentStage: "ORDER_RECEIVED",
        status: "active",
        priority: "MEDIUM",
        estimatedValue: opportunity?.estimatedValue ? Number(opportunity.estimatedValue) : null,
        notes: null,
      },
    });

    await prisma.sCMStageLog.create({
      data: {
        orderId: order.id,
        stage: "ORDER_RECEIVED",
        completedBy: userId != null ? String(userId) : "system",
        triggerSource: "ovf_approved",
      },
    });

    await logScmActivity(
      order.id,
      "ORDER_CREATED",
      `SCM order created from approved OVF ${ovfId} for ${clientName}.`,
      userId,
    );

    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (smtpConfigured) {
      const recipients = await getRoleEmails("SCM");
      if (recipients.length > 0) {
        const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

        await mailer.sendMail({
          to: recipients,
          from,
          subject: `New SCM order ${order.orderRef} created`,
          html: [
            `<p>A new SCM order has been created from an approved OVF.</p>`,
            `<p><strong>Order Ref:</strong> ${order.orderRef}</p>`,
            `<p><strong>Client:</strong> ${clientName}</p>`,
            `<p><strong>Linked Deal ID:</strong> ${dealId}</p>`,
            `<p><strong>Linked OVF ID:</strong> ${ovfId}</p>`,
          ].join(""),
        });
      }
    }

    if (scmUser) {
      await notificationService.createNotification({
        userId: scmUser.id,
        type: "scm_order_created",
        title: "New SCM Order Received",
        message: `OVF approved for ${clientName}. SCM work begins now.`,
        priority: "medium",
        channels: ["in_app"],
      });
    }

    await pipelineSync.advance(dealId, "ovf_approved", userId ?? null, "scm_module");

    return order;
  },

  async getSummary() {
    const activeCount = await prisma.sCMOrder.count({
      where: {
        status: "active",
      },
    });

    return { activeCount };
  },

  async getStats() {
    const [activeCount, completedCount, byStage] = await Promise.all([
      prisma.sCMOrder.count({
        where: { status: "active" },
      }),
      prisma.sCMOrder.count({
        where: { status: "completed" },
      }),
      prisma.sCMOrder.groupBy({
        by: ["currentStage"],
        _count: { _all: true },
      }),
    ]);

    return {
      activeCount,
      completedCount,
      byStage: byStage.map(row => ({
        stage: row.currentStage,
        count: row._count._all,
      })),
    };
  },

  async createOrderManual(data: {
    linkedLeadId?: number | null;
    linkedDealId?: number | null;
    clientName: string;
    clientAddress?: string | null;
    assignedTo: string;
    priority?: string;
    estimatedValue?: number | null;
    expectedDelivery?: Date | null;
    notes?: string | null;
  }) {
    const order = await prisma.sCMOrder.create({
      data: {
        orderRef: `SCM-${Date.now()}`,
        linkedLeadId: data.linkedLeadId != null ? String(data.linkedLeadId) : null,
        linkedDealId: data.linkedDealId != null ? String(data.linkedDealId) : null,
        linkedOVFId: "",
        linkedPOId: null,
        clientName: data.clientName,
        clientAddress: data.clientAddress ?? null,
        assignedTo: data.assignedTo,
        currentStage: "ORDER_RECEIVED",
        status: "active",
        priority: (data.priority as any) ?? "MEDIUM",
        estimatedValue: data.estimatedValue ?? null,
        expectedDelivery: data.expectedDelivery ?? null,
        notes: data.notes ?? null,
      },
    });

    await prisma.sCMStageLog.create({
      data: {
        orderId: order.id,
        stage: "ORDER_RECEIVED",
        completedBy: "system",
        triggerSource: "manual_create",
      },
    });

    return order;
  },

  async listOrders(params: ListOrdersParams) {
    const page = params.page;
    const pageSize = params.pageSize;
    const where: any = {};

    if (params.stage && params.stage !== "All") {
      where.currentStage = params.stage;
    }

    if (params.status && params.status !== "All") {
      where.status = params.status;
    }

    if (params.assignedTo) {
      where.assignedTo = params.assignedTo;
    }

    if (params.role === "SALES") {
      const leads = await prisma.lead.findMany({
        where: { assignedToId: params.userId },
        select: { id: true },
      });
      const leadIds = leads.map(lead => String(lead.id));
      where.linkedLeadId = { in: leadIds };
    } else if (params.role === "DEPLOYMENT") {
      where.currentStage = "SCM_WORK_COMPLETED";
    }

    const [items, total] = await Promise.all([
      prisma.sCMOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.sCMOrder.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  async getOrderById(id: string, params: { role: string; userId: number }) {
    const order = await prisma.sCMOrder.findUnique({
      where: { id },
      include: {
        stageHistory: {
          orderBy: { enteredAt: "asc" },
        },
        procurement: true,
        warehouse: true,
        dispatch: true,
        documents: {
          orderBy: { createdAt: "desc" },
        },
        expenses: {
          orderBy: { date: "desc" },
        },
        emails: {
          orderBy: { sentAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return null;
    }

    if (params.role === "SALES") {
      if (!order.linkedLeadId) {
        return null;
      }
      const leadId = parseInt(order.linkedLeadId, 10);
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
      });
      if (!lead || lead.assignedToId !== params.userId) {
        return null;
      }
    } else if (params.role === "DEPLOYMENT" && order.currentStage !== "SCM_WORK_COMPLETED") {
      return null;
    }

    return order;
  },

  async updateOrder(id: string, data: Partial<{
    clientName: string;
    clientAddress: string | null;
    assignedTo: string;
    status: string;
    priority: string;
    estimatedValue: number | null;
    expectedDelivery: Date | null;
    notes: string | null;
  }>) {
    const updated = await prisma.sCMOrder.update({
      where: { id },
      data: {
        clientName: data.clientName ?? undefined,
        clientAddress: data.clientAddress ?? undefined,
        assignedTo: data.assignedTo ?? undefined,
        status: data.status ?? undefined,
        priority: (data.priority as any) ?? undefined,
        estimatedValue: data.estimatedValue ?? undefined,
        expectedDelivery: data.expectedDelivery ?? undefined,
        notes: data.notes ?? undefined,
      },
    });

    return updated;
  },

  async getStageLogs(orderId: string) {
    return prisma.sCMStageLog.findMany({
      where: { orderId },
      orderBy: { enteredAt: "asc" },
    });
  },

  async advanceStage(orderId: string, newStage: string, userId: number | null, triggerSource: string, notes?: string) {
    const order = await prisma.sCMOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("SCM order not found");
    }

    const lastLog = await prisma.sCMStageLog.findFirst({
      where: { orderId },
      orderBy: { enteredAt: "desc" },
    });

    if (lastLog) {
      const now = new Date();
      const durationMin = differenceInMinutes(now, lastLog.enteredAt);
      await prisma.sCMStageLog.update({
        where: { id: lastLog.id },
        data: {
          exitedAt: now,
          durationMin,
        },
      });
    }

    await prisma.sCMOrder.update({
      where: { id: orderId },
      data: {
        currentStage: newStage,
      },
    });

    await prisma.sCMStageLog.create({
      data: {
        orderId,
        stage: newStage,
        completedBy: userId != null ? String(userId) : "system",
        triggerSource,
        notes: notes ?? null,
      },
    });

    await logScmActivity(
      orderId,
      "STAGE_CHANGE",
      notes && notes.trim().length > 0
        ? `Stage changed to ${newStage}. Notes: ${notes}`
        : `Stage changed to ${newStage}.`,
      userId,
    );

    const dealId = order.linkedDealId ? parseInt(order.linkedDealId, 10) : null;

    if (dealId) {
      await pipelineSync.advance(dealId, `scm_stage_${newStage}`, userId ?? null, "scm_module");
    }
  },

  async getProcurement(orderId: string) {
    return prisma.sCMProcurement.findUnique({
      where: { orderId },
    });
  },

  async upsertProcurement(orderId: string, data: any, userId: number | null) {
    const existing = await prisma.sCMProcurement.findUnique({
      where: { orderId },
    });

    const payload: any = {
      distributorName: data.distributorName ?? undefined,
      distributorContact: data.distributorContact ?? undefined,
      distributorEmail: data.distributorEmail ?? undefined,
      distributorPORef: data.distributorPORef ?? undefined,
      distributorPODate: data.distributorPODate ? new Date(data.distributorPODate) : undefined,
      expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : undefined,
      leadTimeDays: data.leadTimeDays ?? undefined,
      itemList: data.itemList ?? undefined,
      totalValue: data.totalValue ?? undefined,
      oemName: data.oemName ?? undefined,
      oemContact: data.oemContact ?? undefined,
      poSentAt: data.poSentAt ? new Date(data.poSentAt) : undefined,
      poAttachmentUrl: data.poAttachmentUrl ?? undefined,
      status: data.status ?? undefined,
    };

    let record;

    if (existing) {
      record = await prisma.sCMProcurement.update({
        where: { orderId },
        data: payload,
      });
    } else {
      record = await prisma.sCMProcurement.create({
        data: {
          orderId,
          ...payload,
        },
      });
    }

    if (data.poSentAt) {
      await this.advanceStage(orderId, "PO_SENT_TO_DISTRIBUTOR", userId, "procurement_po_sent");
    }

    return record;
  },

  async sendProcurementPo(orderId: string, userId: number | null) {
    const procurement = await prisma.sCMProcurement.findUnique({
      where: { orderId },
    });

    const order = await prisma.sCMOrder.findUnique({
      where: { id: orderId },
    });

    if (!order || !procurement || !procurement.distributorEmail) {
      return;
    }

    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (smtpConfigured) {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

      await mailer.sendMail({
        to: procurement.distributorEmail,
        from,
        subject: `Purchase order for ${order.clientName}`,
        html: [
          `<p>Dear ${procurement.distributorName || "Partner"},</p>`,
          `<p>PO ${procurement.distributorPORef || ""} has been issued for SCM order ${order.orderRef}.</p>`,
        ].join(""),
      });
    }

    await this.upsertProcurement(
      orderId,
      {
        poSentAt: new Date().toISOString(),
        status: "po_sent",
      },
      userId,
    );
  },

  async getWarehouse(orderId: string) {
    return prisma.sCMWarehouse.findUnique({
      where: { orderId },
    });
  },

  async upsertWarehouse(orderId: string, data: any, userId: number | null) {
    const existing = await prisma.sCMWarehouse.findUnique({
      where: { orderId },
    });

    const payload: any = {
      receivedAt: data.receivedAt ? new Date(data.receivedAt) : undefined,
      receivedBy: data.receivedBy ?? undefined,
      grnNumber: data.grnNumber ?? undefined,
      grnAttachmentUrl: data.grnAttachmentUrl ?? undefined,
      itemsVerified: data.itemsVerified ?? undefined,
      verificationNotes: data.verificationNotes ?? undefined,
      damageReported: data.damageReported ?? undefined,
      damageDetails: data.damageDetails ?? undefined,
      photos: data.photos ?? undefined,
    };

    let record;

    if (existing) {
      record = await prisma.sCMWarehouse.update({
        where: { orderId },
        data: payload,
      });
    } else {
      record = await prisma.sCMWarehouse.create({
        data: {
          orderId,
          ...payload,
        },
      });
    }

    if (data.receivedAt) {
      await this.advanceStage(orderId, "MATERIAL_DELIVERED_WAREHOUSE", userId, "warehouse_received");
    }

    return record;
  },

  async confirmWarehouseReceipt(orderId: string, userId: number | null) {
    await this.upsertWarehouse(
      orderId,
      {
        receivedAt: new Date().toISOString(),
      },
      userId,
    );
  },

  async getDispatch(orderId: string) {
    return prisma.sCMDispatch.findUnique({
      where: { orderId },
    });
  },

  async upsertDispatch(orderId: string, data: any, userId: number | null) {
    const existing = await prisma.sCMDispatch.findUnique({
      where: { orderId },
    });

    const payload: any = {
      dispatchDate: data.dispatchDate ? new Date(data.dispatchDate) : undefined,
      vehicleDetails: data.vehicleDetails ?? undefined,
      driverName: data.driverName ?? undefined,
      driverContact: data.driverContact ?? undefined,
      deliveryChallanUrl: data.deliveryChallanUrl ?? undefined,
      deliveryConfirmUrl: data.deliveryConfirmUrl ?? undefined,
      deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
      deliveredTo: data.deliveredTo ?? undefined,
      customerSignatureUrl: data.customerSignatureUrl ?? undefined,
    };

    let record;

    if (existing) {
      record = await prisma.sCMDispatch.update({
        where: { orderId },
        data: payload,
      });
    } else {
      record = await prisma.sCMDispatch.create({
        data: {
          orderId,
          ...payload,
        },
      });
    }

    if (data.dispatchDate) {
      await this.advanceStage(orderId, "WAREHOUSE_DISPATCH_TO_CUSTOMER", userId, "dispatch_started");
    }

    if (data.deliveredAt) {
      await this.advanceStage(orderId, "MR_MRF_DOCS_COLLECTED", userId, "dispatch_delivered");
    }

    return record;
  },

  async confirmDispatchDelivery(orderId: string, data: any, userId: number | null) {
    await this.upsertDispatch(
      orderId,
      {
        deliveredAt: data.deliveredAt || new Date().toISOString(),
        deliveredTo: data.deliveredTo,
        customerSignatureUrl: data.customerSignatureUrl,
      },
      userId,
    );
  },

  async getDocuments(orderId: string) {
    return prisma.sCMDocument.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  },

  async addDocument(orderId: string, data: { type: string; name: string; fileUrl: string; uploadedBy: string }) {
    const doc = await prisma.sCMDocument.create({
      data: {
        orderId,
        type: data.type,
        name: data.name,
        fileUrl: data.fileUrl,
        uploadedBy: data.uploadedBy,
      },
    });

    await logScmActivity(
      orderId,
      "DOCUMENT_UPLOAD",
      `Document uploaded: ${doc.name} (${doc.type}).`,
      Number.isFinite(parseInt(data.uploadedBy, 10)) ? parseInt(data.uploadedBy, 10) : null,
      { fileUrl: doc.fileUrl },
    );

    return doc;
  },

  async shareDocuments(orderId: string, documentIds: string[], accountsEmail: string | null, userId: number | null) {
    const docs = await prisma.sCMDocument.findMany({
      where: {
        id: { in: documentIds },
        orderId,
      },
    });

    const order = await prisma.sCMOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return;
    }

    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (smtpConfigured && docs.length > 0) {
      const recipientsFromRole = await getRoleEmails("ACCOUNTS");
      const explicitRecipient = accountsEmail ? [accountsEmail] : [];
      const recipients = [...new Set([...recipientsFromRole, ...explicitRecipient])];

      if (recipients.length > 0) {
        const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

        await mailer.sendMail({
          to: recipients,
          from,
          subject: `SCM documents shared for order ${order.orderRef}`,
          html: [
            `<p>Documents have been shared for SCM order ${order.orderRef}.</p>`,
            `<ul>${docs.map(doc => `<li>${doc.name} (${doc.type})</li>`).join("")}</ul>`,
          ].join(""),
        });
      }
    }

    const accountsRecipients = accountsEmail
      ? [accountsEmail]
      : await getRoleEmails("ACCOUNTS");

    await prisma.sCMDocument.updateMany({
      where: { id: { in: documentIds } },
      data: {
        sharedWith: accountsRecipients.length > 0 ? (accountsRecipients as any) : undefined,
        sharedAt: new Date(),
      } as any,
    });

    await this.advanceStage(orderId, "DOCS_SHARED_WITH_ACCOUNTS", userId, "docs_shared");

    await logScmActivity(
      orderId,
      "DOCUMENT_SHARED",
      `Documents shared with accounts for order ${order.orderRef}.`,
      userId,
    );
  },

  async getExpenses(orderId: string) {
    return prisma.sCMExpense.findMany({
      where: { orderId },
      orderBy: { date: "desc" },
    });
  },

  async addExpense(orderId: string, data: any) {
    const expense = await prisma.sCMExpense.create({
      data: {
        orderId,
        category: data.category,
        description: data.description,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
        receiptUrl: data.receiptUrl ?? null,
        status: data.status ?? "pending",
        approvedBy: data.approvedBy ?? null,
      },
    });

    await logScmActivity(
      orderId,
      "EXPENSE_ADDED",
      `Expense added: ${expense.category} for ₹${expense.amount}.`,
      null,
    );

    return expense;
  },

  async updateExpenseStatus(orderId: string, expenseId: string, status: string, approvedBy: string | null) {
    const result = await prisma.sCMExpense.updateMany({
      where: {
        id: expenseId,
        orderId,
      },
      data: {
        status,
        approvedBy: approvedBy ?? undefined,
      },
    });

    await logScmActivity(
      orderId,
      "EXPENSE_STATUS",
      `Expense ${expenseId} status updated to ${status}.`,
      approvedBy ? parseInt(approvedBy, 10) || null : null,
    );

    return result;
  },

  async getEmails(orderId: string) {
    return prisma.sCMEmail.findMany({
      where: { orderId },
      orderBy: { sentAt: "desc" },
    });
  },

  async sendEmail(
    orderId: string,
    data: { to: string[]; cc?: string[]; subject: string; body: string; sentBy: string; type?: string },
  ) {
    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (smtpConfigured) {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

      if (data.to.length > 0) {
        const htmlBody = data.body;

        await mailer.sendMail({
          to: data.to,
          cc: data.cc,
          from,
          subject: data.subject,
          html: htmlBody,
        });
      }
    }

    const email = await prisma.sCMEmail.create({
      data: {
        orderId,
        to: data.to,
        cc: data.cc ?? [],
        subject: data.subject,
        body: data.body,
        sentBy: data.sentBy,
        type: data.type ?? "custom",
      },
    });

    await logScmActivity(
      orderId,
      "EMAIL_SENT",
      `Email sent with subject "${email.subject}" to ${email.to.join(", ")}.`,
      Number.isFinite(parseInt(data.sentBy, 10)) ? parseInt(data.sentBy, 10) : null,
    );

    return email;
  },

  async completeOrder(orderId: string, userId: number | null) {
    const order = await prisma.sCMOrder.update({
      where: { id: orderId },
      data: {
        status: "completed",
      },
    });

    await this.advanceStage(orderId, "SCM_WORK_COMPLETED", userId, "manual_complete");

    const deploymentUser = await prisma.user.findFirst({
      where: {
        role: {
          name: "DEPLOYMENT",
        },
      },
      include: {
        role: true,
      },
    });

    if (deploymentUser) {
      await notificationService.createNotification({
        userId: deploymentUser.id,
        type: "scm_work_completed",
        title: "SCM work completed",
        message: `SCM order ${order.orderRef} is complete. Deployment can start.`,
        priority: "medium",
        channels: ["in_app"],
      });
    }

    await logScmActivity(
      orderId,
      "ORDER_COMPLETED",
      `SCM order ${order.orderRef} marked as completed.`,
      userId,
    );

    const numericLeadId = order.linkedLeadId ? parseInt(order.linkedLeadId, 10) : NaN;
    const numericDealId = order.linkedDealId ? parseInt(order.linkedDealId, 10) : NaN;

    if (Number.isFinite(numericLeadId) && Number.isFinite(numericDealId)) {
      await deploymentService.initializeDeployment({
        scmOrderId: order.id,
        dealId: numericDealId as number,
        leadId: numericLeadId as number,
        clientName: order.clientName,
        clientAddress: order.clientAddress,
        assignedBy: userId,
      });
    }

    return order;
  },

  async getActivities(orderId: string) {
    return prisma.sCMActivity.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  },

  async addManualActivity(
    orderId: string,
    data: { type: string; description: string; fileUrl?: string | null },
    userId: number | null,
  ) {
    const createdBy = userId != null ? String(userId) : "system";

    const activity = await prisma.sCMActivity.create({
      data: {
        orderId,
        type: data.type,
        description: data.description,
        createdBy,
        fileUrl: data.fileUrl ?? null,
      },
    });

    return activity;
  },
};
