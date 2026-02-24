import { differenceInMinutes } from "date-fns";
import { prisma } from "../../prisma";
import { mailer } from "../../utils/mailer";
import { pipelineSync } from "../../utils/pipelineSync";
import { deploymentEmailTemplates } from "../../utils/deploymentEmailTemplates";
import { notificationService } from "../notifications/service";

async function logDeploymentActivity(
  projectId: string,
  type: string,
  description: string,
  userId: number | null,
  extra?: { fileUrl?: string | null },
) {
  const createdBy = userId != null ? String(userId) : "system";

  await prisma.deploymentActivity.create({
    data: {
      projectId,
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

const DEPLOYMENT_STAGES: string[] = [
  "INITIATED",
  "KICKOFF_MEETING",
  "SITE_SURVEY",
  "INFRA_ASSESSMENT",
  "FLOOR_LAYOUT_ACCESS",
  "MATERIAL_REQUEST",
  "MATERIAL_DISPATCHED",
  "DEPLOYMENT_START",
  "MATERIAL_VERIFICATION",
  "ENGINEER_VISIT_ALIGNMENT",
  "RACK_INSTALLATION",
  "SERVER_NODE_SETUP",
  "STORAGE_SETUP",
  "POWER_ON",
  "CONFIGURATION",
  "HEALTH_TESTING",
  "UAT",
  "GO_LIVE",
];

async function resolveProjectContacts(projectId: string) {
  const project = await prisma.deploymentProject.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return {
      project: null,
      clientEmail: null,
      salesUser: null,
      managerUser: null,
    };
  }

  let clientEmail: string | null = null;
  let salesUser: any = null;

  if (project.linkedLeadId) {
    const leadId = parseInt(project.linkedLeadId, 10);
    if (Number.isFinite(leadId)) {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          assignedTo: true,
        },
      });

      if (lead) {
        clientEmail = (lead as any).email ?? null;
        // @ts-ignore
        salesUser = (lead as any).assignedTo ?? null;
      }
    }
  }

  if (!salesUser && project.linkedDealId) {
    const dealId = parseInt(project.linkedDealId, 10);
    if (Number.isFinite(dealId)) {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: dealId },
        include: {
          assignedTo: true,
          lead: true,
        },
      });

      if (opportunity) {
        if (!clientEmail && (opportunity as any).lead) {
          // @ts-ignore
          clientEmail = ((opportunity as any).lead as any).email ?? null;
        }
        // @ts-ignore
        salesUser = (opportunity as any).assignedTo ?? null;
      }
    }
  }

  let managerUser: any = null;
  if (project.assignedManagerId) {
    const managerId = parseInt(project.assignedManagerId, 10);
    if (Number.isFinite(managerId)) {
      managerUser = await prisma.user.findUnique({
        where: { id: managerId },
      });
    }
  }

  return {
    project,
    clientEmail,
    salesUser,
    managerUser,
  };
}

type InitializeDeploymentParams = {
  scmOrderId: string;
  dealId: number;
  leadId: number;
  clientName: string;
  clientAddress: string | null;
  assignedBy: number | null;
};

type ListProjectsParams = {
  page: number;
  pageSize: number;
  status?: string | null;
  role: string;
  userId: number;
};

export const deploymentService = {
  async initializeDeployment(params: InitializeDeploymentParams) {
    const { scmOrderId, dealId, leadId, clientName, clientAddress, assignedBy } = params;

    const existing = await prisma.deploymentProject.findFirst({
      where: {
        linkedSCMOrderId: scmOrderId,
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

    const resolvedClientName = clientName || lead?.companyName || opportunity?.companyName || "Unknown client";
    const resolvedClientAddress =
      clientAddress || [lead?.city, lead?.state].filter(Boolean).join(", ") || null;

    const deploymentManager = await prisma.user.findFirst({
      where: {
        role: {
          name: "DEPLOYMENT",
        },
      },
    });

    const assignedManagerId = deploymentManager ? String(deploymentManager.id) : String(assignedBy ?? "system");

    const project = await prisma.deploymentProject.create({
      data: {
        projectRef: `DEP-${Date.now()}`,
        linkedSCMOrderId: scmOrderId,
        linkedLeadId: String(leadId),
        linkedDealId: String(dealId),
        clientName: resolvedClientName,
        clientAddress: resolvedClientAddress,
        assignedManagerId,
        currentStage: "INITIATED",
        status: "active",
        priority: "MEDIUM",
      },
    });

    await prisma.deploymentStageLog.create({
      data: {
        projectId: project.id,
        stage: "INITIATED",
        completedBy: assignedManagerId,
        triggerSource: "scm_work_completed",
      },
    });

    const defaultTasks = [
      { title: "Schedule kickoff meeting with client", stage: "KICKOFF_MEETING", priority: "HIGH" },
      { title: "Prepare kickoff meeting agenda", stage: "KICKOFF_MEETING", priority: "MEDIUM" },
      { title: "Conduct site survey", stage: "SITE_SURVEY", priority: "HIGH" },
      { title: "Fill site survey form completely", stage: "SITE_SURVEY", priority: "HIGH" },
      { title: "Assess server infrastructure", stage: "INFRA_ASSESSMENT", priority: "HIGH" },
      { title: "Assess network infrastructure", stage: "INFRA_ASSESSMENT", priority: "HIGH" },
      { title: "Assess security infrastructure", stage: "INFRA_ASSESSMENT", priority: "MEDIUM" },
    ];

    for (const task of defaultTasks) {
      await prisma.deploymentTask.create({
        data: {
          projectId: project.id,
          title: task.title,
          stage: task.stage as any,
          priority: task.priority as any,
          assignedTo: assignedManagerId,
          assignedBy: assignedManagerId,
          status: "pending",
        },
      });
    }

    await logDeploymentActivity(
      project.id,
      "PROJECT_CREATED",
      `Deployment project created from SCM order ${scmOrderId} for ${resolvedClientName}.`,
      assignedBy,
    );

    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (smtpConfigured) {
      const recipients = await getRoleEmails("DEPLOYMENT");
      if (recipients.length > 0) {
        const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

        await mailer.sendMail({
          to: recipients,
          from,
          subject: `New deployment project ${project.projectRef} created`,
          html: [
            `<p>A new deployment project has been created from a completed SCM order.</p>`,
            `<p><strong>Project Ref:</strong> ${project.projectRef}</p>`,
            `<p><strong>Client:</strong> ${resolvedClientName}</p>`,
            `<p><strong>Linked Deal ID:</strong> ${dealId}</p>`,
            `<p><strong>Linked SCM Order ID:</strong> ${scmOrderId}</p>`,
          ].join(""),
        });

        await prisma.deploymentEmail.create({
          data: {
            projectId: project.id,
            to: recipients,
            cc: [],
            subject: `New deployment project ${project.projectRef} created`,
            body: `Deployment project created from SCM order ${scmOrderId} for ${resolvedClientName}.`,
            sentBy: assignedManagerId,
            type: "deployment_init",
          },
        });
      }
    }

    if (deploymentManager) {
      await notificationService.createNotification({
        userId: deploymentManager.id,
        type: "deployment_project_created",
        title: "New Deployment Project",
        message: `SCM completed for ${resolvedClientName}. Deployment work begins now. Ref: ${project.projectRef}`,
        priority: "medium",
        channels: ["in_app"],
      });
    }

    await pipelineSync.advance(dealId, "deployment_initiated", assignedBy ?? null, "deployment_module");

    return project;
  },

  async getSummary() {
    const activeCount = await prisma.deploymentProject.count({
      where: {
        status: "active",
      },
    });

    return { activeCount };
  },

  async listProjects(params: ListProjectsParams) {
    const page = params.page;
    const pageSize = params.pageSize;

    const where: any = {};

    if (params.status && params.status !== "All") {
      where.status = params.status;
    }

    if (params.role === "DEPLOYMENT") {
      where.assignedManagerId = String(params.userId);
    }

    if (params.role === "SALES") {
      const leads = await prisma.lead.findMany({
        where: {
          assignedToId: params.userId,
        },
        select: { id: true },
      });
      const leadIds = leads.map(l => String(l.id));

      if (leadIds.length === 0) {
        return {
          items: [],
          total: 0,
          page,
          pageSize,
        };
      }

      where.linkedLeadId = { in: leadIds };
    }

    const total = await prisma.deploymentProject.count({ where });

    const items = await prisma.deploymentProject.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  async getStats() {
    const [activeCount, completedCount, byStage] = await Promise.all([
      prisma.deploymentProject.count({
        where: { status: "active" },
      }),
      prisma.deploymentProject.count({
        where: { status: "completed" },
      }),
      prisma.deploymentProject.groupBy({
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

  async createProjectManual(data: {
    linkedLeadId?: number | null;
    linkedDealId?: number | null;
    clientName: string;
    clientAddress?: string | null;
    assignedManagerId: string;
    priority?: string;
    kickoffDate?: Date | null;
    expectedGoLive?: Date | null;
    notes?: string | null;
  }) {
    const project = await prisma.deploymentProject.create({
      data: {
        projectRef: `DEP-${Date.now()}`,
        linkedSCMOrderId: "",
        linkedLeadId: data.linkedLeadId != null ? String(data.linkedLeadId) : null,
        linkedDealId: data.linkedDealId != null ? String(data.linkedDealId) : null,
        clientName: data.clientName,
        clientAddress: data.clientAddress ?? null,
        assignedManagerId: data.assignedManagerId,
        currentStage: "INITIATED",
        status: "active",
        priority: (data.priority as any) ?? "MEDIUM",
        kickoffDate: data.kickoffDate ?? null,
        expectedGoLive: data.expectedGoLive ?? null,
        notes: data.notes ?? null,
      },
    });

    await prisma.deploymentStageLog.create({
      data: {
        projectId: project.id,
        stage: "INITIATED",
        completedBy: data.assignedManagerId,
        triggerSource: "manual_create",
      },
    });

    return project;
  },

  async getProjectById(id: string, params: { role: string; userId: number }) {
    const project = await prisma.deploymentProject.findUnique({
      where: { id },
      include: {
        stageHistory: {
          orderBy: { enteredAt: "asc" },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
        },
        siteSurvey: true,
        infraAssessment: true,
        materialRequests: {
          orderBy: { createdAt: "desc" },
        },
        engineers: {
          orderBy: { assignedAt: "desc" },
        },
        emails: {
          orderBy: { sentAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return null;
    }

    if (params.role === "DEPLOYMENT" && project.assignedManagerId !== String(params.userId)) {
      return null;
    }

    if (params.role === "SALES") {
      if (!project.linkedLeadId) {
        return null;
      }
      const leadId = parseInt(project.linkedLeadId, 10);
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
      });
      if (!lead || lead.assignedToId !== params.userId) {
        return null;
      }
    }

    return project;
  },

  async updateProject(
    id: string,
    data: Partial<{
      clientName: string;
      clientAddress: string | null;
      assignedManagerId: string;
      status: string;
      priority: string;
      kickoffDate: Date | null;
      expectedGoLive: Date | null;
      actualGoLive: Date | null;
      goLiveSignoffUrl: string | null;
      notes: string | null;
    }>,
  ) {
    const updated = await prisma.deploymentProject.update({
      where: { id },
      data: {
        clientName: data.clientName ?? undefined,
        clientAddress: data.clientAddress ?? undefined,
        assignedManagerId: data.assignedManagerId ?? undefined,
        status: data.status ?? undefined,
        priority: (data.priority as any) ?? undefined,
        kickoffDate: data.kickoffDate ?? undefined,
        expectedGoLive: data.expectedGoLive ?? undefined,
        actualGoLive: data.actualGoLive ?? undefined,
        goLiveSignoffUrl: data.goLiveSignoffUrl ?? undefined,
        notes: data.notes ?? undefined,
      },
    });

    return updated;
  },

  async getStageLogs(projectId: string) {
    return prisma.deploymentStageLog.findMany({
      where: { projectId },
      orderBy: { enteredAt: "asc" },
    });
  },

  async advanceStage(
    projectId: string,
    newStage: string,
    userId: number | null,
    triggerSource: string,
    notes?: string,
  ) {
    const project = await prisma.deploymentProject.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Deployment project not found");
    }

    const lastLog = await prisma.deploymentStageLog.findFirst({
      where: { projectId },
      orderBy: { enteredAt: "desc" },
    });

    if (lastLog) {
      const now = new Date();
      const durationMin = differenceInMinutes(now, lastLog.enteredAt);
      await prisma.deploymentStageLog.update({
        where: { id: lastLog.id },
        data: {
          exitedAt: now,
          durationMin,
        },
      });
    }

    await prisma.deploymentProject.update({
      where: { id: projectId },
      data: {
        currentStage: newStage,
      },
    });

    await prisma.deploymentStageLog.create({
      data: {
        projectId,
        stage: newStage as any,
        completedBy: userId != null ? String(userId) : "system",
        triggerSource,
        notes: notes ?? null,
      },
    });

    await logDeploymentActivity(
      projectId,
      "STAGE_CHANGE",
      notes && notes.trim().length > 0
        ? `Stage changed to ${newStage}. Notes: ${notes}`
        : `Stage changed to ${newStage}.`,
      userId,
    );
  },

  async getTasks(projectId: string) {
    return prisma.deploymentTask.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getTasksForEngineer(params: {
    userId: number;
    status?: string;
    projectId?: string;
    priority?: string;
  }) {
    const where: any = {
      assignedTo: String(params.userId),
    };

    if (params.status && params.status !== "all") {
      where.status = params.status;
    }

    if (params.projectId && params.projectId !== "all") {
      where.projectId = params.projectId;
    }

    if (params.priority && params.priority !== "all") {
      where.priority = params.priority as any;
    }

    return prisma.deploymentTask.findMany({
      where,
      include: {
        project: true,
      },
      orderBy: [
        {
          dueDate: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  },

  async createTask(
    projectId: string,
    data: {
      title: string;
      description?: string | null;
      stage: string;
      assignedTo: string;
      assignedBy: string;
      priority?: string;
      dueDate?: Date | null;
    },
    userId: number | null,
  ) {
    const task = await prisma.deploymentTask.create({
      data: {
        projectId,
        title: data.title,
        description: data.description ?? null,
        stage: data.stage as any,
        assignedTo: data.assignedTo,
        assignedBy: data.assignedBy,
        priority: (data.priority as any) ?? "MEDIUM",
        dueDate: data.dueDate ?? null,
      },
    });

    await logDeploymentActivity(
      projectId,
      "TASK_CREATED",
      `Task "${task.title}" created for stage ${task.stage}.`,
      userId,
    );

    const project = await prisma.deploymentProject.findUnique({
      where: { id: projectId },
    });

    if (project) {
      const engineerId = parseInt(task.assignedTo, 10);
      const managerId = parseInt(project.assignedManagerId, 10);

      const engineer =
        Number.isFinite(engineerId) && engineerId > 0
          ? await prisma.user.findUnique({ where: { id: engineerId } })
          : null;
      const manager =
        Number.isFinite(managerId) && managerId > 0
          ? await prisma.user.findUnique({ where: { id: managerId } })
          : null;

      if (engineer && engineer.email) {
        const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
        const taskLink = `${baseUrl}/deployment/projects/${projectId}`;
        const dueDateStr = task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "Not set";

        const subject = `Task Assigned: ${task.title} — ${project.clientName} | ${project.projectRef}`;

        const bodyLines = [
          `Hi ${engineer.name || "there"},`,
          "",
          "You have been assigned a new deployment task:",
          "",
          `Client: ${project.clientName}`,
          `Project: ${project.projectRef}`,
          `Task: ${task.title}`,
          `Stage: ${task.stage}`,
          `Priority: ${task.priority}`,
          `Due date: ${dueDateStr}`,
          "",
          `Task link: ${taskLink}`,
          "",
          "Please review the task details and plan accordingly.",
          "",
          manager && manager.name ? `Thanks,\n${manager.name}` : "Thanks,",
        ];

        const to = [engineer.email];
        const cc: string[] = [];
        if (manager && manager.email) {
          cc.push(manager.email);
        }

        await this.sendEmail(projectId, {
          to,
          cc,
          subject,
          body: bodyLines.join("\n"),
          sentBy: manager ? String(manager.id) : userId != null ? String(userId) : "system",
          type: "task_assignment",
        });
      }

      if (engineer) {
        await notificationService.createNotification({
          userId: engineer.id,
          type: "deployment_task_assigned",
          title: `Task Assigned: ${task.title}`,
          message: `New deployment task assigned on project ${project.projectRef} for ${project.clientName}.`,
          priority: "medium",
          channels: ["in_app"],
        });
      }
    }

    return task;
  },

  async updateTask(
    projectId: string,
    taskId: string,
    data: Partial<{
      title: string;
      description: string | null;
      stage: string;
      assignedTo: string;
      priority: string;
      status: string;
      dueDate: Date | null;
    }>,
  ) {
    const existing = await prisma.deploymentTask.findUnique({
      where: { id: taskId },
    });

    const updated = await prisma.deploymentTask.update({
      where: { id: taskId },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        stage: (data.stage as any) ?? undefined,
        assignedTo: data.assignedTo ?? undefined,
        priority: (data.priority as any) ?? undefined,
        status: data.status ?? undefined,
        dueDate: data.dueDate ?? undefined,
      },
    });

    if (existing && data.assignedTo && existing.assignedTo !== data.assignedTo) {
      const project = await prisma.deploymentProject.findUnique({
        where: { id: projectId },
      });

      if (project) {
        const engineerId = parseInt(updated.assignedTo, 10);
        const managerId = parseInt(project.assignedManagerId, 10);

        const engineer =
          Number.isFinite(engineerId) && engineerId > 0
            ? await prisma.user.findUnique({ where: { id: engineerId } })
            : null;
        const manager =
          Number.isFinite(managerId) && managerId > 0
            ? await prisma.user.findUnique({ where: { id: managerId } })
            : null;

        if (engineer && engineer.email) {
          const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
          const taskLink = `${baseUrl}/deployment/projects/${projectId}`;
          const dueDateStr = updated.dueDate ? updated.dueDate.toISOString().slice(0, 10) : "Not set";

          const subject = `Task Assigned: ${updated.title} — ${project.clientName} | ${project.projectRef}`;

          const bodyLines = [
            `Hi ${engineer.name || "there"},`,
            "",
            "You have been assigned a new deployment task:",
            "",
            `Client: ${project.clientName}`,
            `Project: ${project.projectRef}`,
            `Task: ${updated.title}`,
            `Stage: ${updated.stage}`,
            `Priority: ${updated.priority}`,
            `Due date: ${dueDateStr}`,
            "",
            `Task link: ${taskLink}`,
            "",
            "Please review the task details and plan accordingly.",
            "",
            manager && manager.name ? `Thanks,\n${manager.name}` : "Thanks,",
          ];

          const to = [engineer.email];
          const cc: string[] = [];
          if (manager && manager.email) {
            cc.push(manager.email);
          }

          await this.sendEmail(projectId, {
            to,
            cc,
            subject,
            body: bodyLines.join("\n"),
            sentBy: manager ? String(manager.id) : "system",
            type: "task_assignment",
          });
        }

        if (engineer) {
          await notificationService.createNotification({
            userId: engineer.id,
            type: "deployment_task_assigned",
            title: `Task Assigned: ${updated.title}`,
            message: `Deployment task reassigned on project ${project.projectRef} for ${project.clientName}.`,
            priority: "medium",
            channels: ["in_app"],
          });
        }
      }
    }

    return updated;
  },

  async completeTask(
    projectId: string,
    taskId: string,
    data: { completionNote?: string | null; evidenceUrl?: string | null },
    userId: number | null,
  ) {
    const updated = await prisma.deploymentTask.update({
      where: { id: taskId },
      data: {
        status: "completed",
        completedAt: new Date(),
        completionNote: data.completionNote ?? null,
        evidenceUrl: data.evidenceUrl ?? null,
      },
    });

    await logDeploymentActivity(
      projectId,
      "TASK_COMPLETED",
      data.completionNote && data.completionNote.trim().length > 0
        ? `Task "${updated.title}" completed. Note: ${data.completionNote}`
        : `Task "${updated.title}" completed.`,
      userId,
      { fileUrl: data.evidenceUrl ?? undefined },
    );

    const remaining = await prisma.deploymentTask.count({
      where: {
        projectId,
        stage: updated.stage,
        status: {
          not: "completed",
        },
      },
    });

    if (remaining === 0) {
      const currentIndex = DEPLOYMENT_STAGES.indexOf(updated.stage as string);
      if (currentIndex >= 0 && currentIndex < DEPLOYMENT_STAGES.length - 1) {
        const nextStage = DEPLOYMENT_STAGES[currentIndex + 1];
        await this.advanceStage(projectId, nextStage, userId, "auto_tasks_complete");

        const project = await prisma.deploymentProject.findUnique({
          where: { id: projectId },
        });

        if (project && project.assignedManagerId) {
          const managerId = parseInt(project.assignedManagerId, 10);
          if (Number.isFinite(managerId)) {
            const manager = await prisma.user.findUnique({
              where: { id: managerId },
            });

            if (manager) {
              await notificationService.createNotification({
                userId: manager.id,
                type: "deployment_stage_auto_advanced",
                title: `Stage auto-advanced to ${nextStage}`,
                message: `All tasks for stage ${updated.stage} are completed for project ${project.projectRef} (${project.clientName}).`,
                priority: "medium",
                channels: ["in_app"],
              });
            }
          }
        }
      }
    }

    return updated;
  },

  async getEngineers(projectId: string) {
    return prisma.deploymentEngineer.findMany({
      where: { projectId },
      orderBy: { assignedAt: "desc" },
    });
  },

  async assignEngineer(
    projectId: string,
    data: { userId: string; role: string; assignedBy: string },
    userId: number | null,
  ) {
    const engineer = await prisma.deploymentEngineer.create({
      data: {
        projectId,
        userId: data.userId,
        role: data.role,
        assignedBy: data.assignedBy,
      },
    });

    await logDeploymentActivity(
      projectId,
      "ENGINEER_ASSIGNED",
      `Engineer ${data.userId} assigned as ${data.role}.`,
      userId,
    );

    return engineer;
  },

  async removeEngineer(projectId: string, engId: string, userId: number | null) {
    const engineer = await prisma.deploymentEngineer.delete({
      where: { id: engId },
    });

    await logDeploymentActivity(
      projectId,
      "ENGINEER_REMOVED",
      `Engineer ${engineer.userId} removed from project.`,
      userId,
    );
  },

  async getSiteSurvey(projectId: string) {
    return prisma.deploymentSiteSurvey.findUnique({
      where: { projectId },
    });
  },

  async listSiteSurveys() {
    return prisma.deploymentSiteSurvey.findMany({
      include: {
        project: true,
      },
      orderBy: {
        surveyDate: "desc",
      },
    });
  },

  async upsertSiteSurvey(projectId: string, data: any) {
    const existing = await prisma.deploymentSiteSurvey.findUnique({
      where: { projectId },
    });

    if (existing) {
      return prisma.deploymentSiteSurvey.update({
        where: { projectId },
        data: {
          ...data,
        },
      });
    }

    return prisma.deploymentSiteSurvey.create({
      data: {
        projectId,
        ...data,
      },
    });
  },

  async completeSiteSurvey(projectId: string, userId: number | null) {
    await prisma.deploymentSiteSurvey.update({
      where: { projectId },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    await this.advanceStage(projectId, "SITE_SURVEY", userId, "site_survey_completed");
    await this.advanceStage(projectId, "INFRA_ASSESSMENT", userId, "auto_from_site_survey");
  },

  async getInfra(projectId: string) {
    return prisma.infraAssessment.findUnique({
      where: { projectId },
    });
  },

  async upsertInfra(projectId: string, data: any) {
    const existing = await prisma.infraAssessment.findUnique({
      where: { projectId },
    });

    let infra;

    if (existing) {
      infra = await prisma.infraAssessment.update({
        where: { projectId },
        data: {
          ...data,
        },
      });
    } else {
      infra = await prisma.infraAssessment.create({
        data: {
          projectId,
          ...data,
        },
      });
    }

    if (infra.itApproval && infra.facilitiesApproval && infra.securityClearance) {
      await this.advanceStage(projectId, "FLOOR_LAYOUT_ACCESS", null, "infra_all_approvals");
    }

    return infra;
  },

  async completeInfra(projectId: string, userId: number | null) {
    await prisma.infraAssessment.update({
      where: { projectId },
      data: {
        completedAt: new Date(),
      },
    });
  },

  async getMaterials(projectId: string) {
    return prisma.materialRequest.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  },

  async createMaterialRequest(
    projectId: string,
    data: { items: any; requestedBy: string; attachmentUrl?: string | null },
    userId: number | null,
  ) {
    const request = await prisma.materialRequest.create({
      data: {
        projectId,
        requestRef: `MR-${Date.now()}`,
        items: data.items,
        requestedBy: data.requestedBy,
        attachmentUrl: data.attachmentUrl ?? null,
      },
    });

    await logDeploymentActivity(
      projectId,
      "MATERIAL_REQUEST_CREATED",
      `Material request ${request.requestRef} created.`,
      userId,
      { fileUrl: data.attachmentUrl ?? undefined },
    );

    await this.advanceStage(projectId, "MATERIAL_REQUEST", userId, "material_request_created");

    return request;
  },

  async updateMaterialRequest(
    projectId: string,
    mrId: string,
    data: Partial<{ status: string; dispatchedAt: Date | null; receivedAt: Date | null }>,
    userId: number | null,
  ) {
    const updated = await prisma.materialRequest.update({
      where: { id: mrId },
      data: {
        status: data.status ?? undefined,
        dispatchedAt: data.dispatchedAt ?? undefined,
        receivedAt: data.receivedAt ?? undefined,
      },
    });

    const isDispatched =
      (updated.status && updated.status.toLowerCase() === "dispatched") || updated.dispatchedAt != null;

    if (isDispatched) {
      await this.advanceStage(projectId, "MATERIAL_DISPATCHED", userId, "material_dispatched");

      const contacts = await resolveProjectContacts(projectId);
      const project = contacts.project;
      const clientEmail = contacts.clientEmail;
      const salesUser = contacts.salesUser;

      if (project && clientEmail) {
        const subjectTemplate = deploymentEmailTemplates.material_dispatched.subject;
        const bodyTemplate = deploymentEmailTemplates.material_dispatched.body;

        const subject = subjectTemplate.replace("[clientName]", project.clientName);
        const body = bodyTemplate
          .replace("[clientName]", project.clientName)
          .replace("[clientAddress]", project.clientAddress ?? "");

        const to = [clientEmail];
        const cc: string[] = [];
        if (salesUser && (salesUser as any).email) {
          cc.push((salesUser as any).email as string);
        }

        const sentBy =
          userId != null
            ? String(userId)
            : salesUser
            ? String((salesUser as any).id)
            : "system";

        await this.sendEmail(projectId, {
          to,
          cc,
          subject,
          body,
          sentBy,
          type: "material_dispatched",
        });
      }
    }

    return updated;
  },

  async verifyMaterial(
    projectId: string,
    mrId: string,
    data: { verifiedBy: string },
    userId: number | null,
  ) {
    const updated = await prisma.materialRequest.update({
      where: { id: mrId },
      data: {
        verifiedBy: data.verifiedBy,
        receivedAt: new Date(),
        status: "verified",
      },
    });

    await this.advanceStage(projectId, "MATERIAL_VERIFICATION", userId, "material_verified");

    await logDeploymentActivity(
      projectId,
      "MATERIAL_VERIFIED",
      `Material request ${updated.requestRef} verified at site.`,
      userId,
    );

    return updated;
  },

  async getEmails(projectId: string) {
    return prisma.deploymentEmail.findMany({
      where: { projectId },
      orderBy: { sentAt: "desc" },
    });
  },

  async sendEmail(
    projectId: string,
    data: {
      to: string[];
      cc?: string[];
      subject: string;
      body: string;
      sentBy: string;
      type?: string;
    },
  ) {
    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    const htmlBody = data.body;

    if (smtpConfigured) {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

      await mailer.sendMail({
        to: data.to,
        cc: data.cc,
        from,
        subject: data.subject,
        html: htmlBody,
      });
    }

    const email = await prisma.deploymentEmail.create({
      data: {
        projectId,
        to: data.to,
        cc: data.cc ?? [],
        subject: data.subject,
        body: data.body,
        sentBy: data.sentBy,
        type: data.type ?? "custom",
      },
    });

    await logDeploymentActivity(
      projectId,
      "EMAIL_SENT",
      `Email sent with subject "${email.subject}" to ${email.to.join(", ")}.`,
      Number.isFinite(parseInt(data.sentBy, 10)) ? parseInt(data.sentBy, 10) : null,
    );

    return email;
  },

  async markGoLive(
    projectId: string,
    data: { goLiveSignoffUrl?: string | null; actualGoLive?: Date | null },
    userId: number | null,
  ) {
    const project = await prisma.deploymentProject.update({
      where: { id: projectId },
      data: {
        status: "completed",
        currentStage: "GO_LIVE",
        goLiveSignoffUrl: data.goLiveSignoffUrl ?? null,
        actualGoLive: data.actualGoLive ?? new Date(),
      },
    });

    await this.advanceStage(projectId, "GO_LIVE", userId, "go_live_marked");

    if (project.linkedDealId) {
      const dealId = parseInt(project.linkedDealId, 10);
      if (Number.isFinite(dealId)) {
        await pipelineSync.advance(dealId, "deal_won", userId ?? null, "deployment_module");
      }
    }

    const contacts = await resolveProjectContacts(projectId);
    const clientEmail = contacts.clientEmail;
    const salesUser = contacts.salesUser;
    const managerUser = contacts.managerUser;

    const managementUsers = await prisma.user.findMany({
      where: {
        role: {
          name: "MANAGEMENT",
        },
        isActive: true,
      },
    });

    const notificationRecipients: any[] = [];

    if (salesUser) {
      notificationRecipients.push(salesUser);
    }

    if (managerUser) {
      notificationRecipients.push(managerUser);
    }

    for (const user of managementUsers) {
      notificationRecipients.push(user);
    }

    const uniqueRecipients = new Map<number, any>();
    for (const user of notificationRecipients) {
      if (user && typeof user.id === "number" && !uniqueRecipients.has(user.id)) {
        uniqueRecipients.set(user.id, user);
      }
    }

    const notifications = Array.from(uniqueRecipients.values()).map(user =>
      notificationService.createNotification({
        userId: user.id,
        type: "deployment_golive",
        title: "Deployment Go-Live Completed",
        message: `Deployment for ${project.clientName} (${project.projectRef}) is now live.`,
        priority: "high",
        channels: ["in_app"],
      }),
    );

    await Promise.all(notifications);

    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (smtpConfigured && clientEmail) {
      const subjectTemplate = deploymentEmailTemplates.golive.subject;
      const bodyTemplate = deploymentEmailTemplates.golive.body;

      const subject = subjectTemplate
        .replace("[clientName]", project.clientName)
        .replace("[projectRef]", project.projectRef);

      const body = bodyTemplate
        .replace("[clientName]", project.clientName)
        .replace("[projectRef]", project.projectRef)
        .replace("[clientAddress]", project.clientAddress ?? "");

      const to = [clientEmail];
      const cc: string[] = [];

      if (salesUser && (salesUser as any).email) {
        cc.push((salesUser as any).email as string);
      }

      for (const user of managementUsers) {
        if (user.email) {
          cc.push(user.email);
        }
      }

      const uniqueTo = Array.from(new Set(to));
      const uniqueCc = Array.from(new Set(cc.filter(email => !uniqueTo.includes(email))));

      const sentBy =
        userId != null
          ? String(userId)
          : managerUser
          ? String((managerUser as any).id)
          : "system";

      await this.sendEmail(projectId, {
        to: uniqueTo,
        cc: uniqueCc,
        subject,
        body,
        sentBy,
        type: "deployment_golive",
      });
    }

    await logDeploymentActivity(
      projectId,
      "GO_LIVE",
      `Deployment marked as GO_LIVE for project ${project.projectRef}.`,
      userId,
      { fileUrl: data.goLiveSignoffUrl ?? undefined },
    );

    return project;
  },

  async getActivities(projectId: string) {
    return prisma.deploymentActivity.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  },

  async addManualActivity(
    projectId: string,
    data: { type: string; description: string; fileUrl?: string | null },
    userId: number | null,
  ) {
    const createdBy = userId != null ? String(userId) : "system";

    const activity = await prisma.deploymentActivity.create({
      data: {
        projectId,
        type: data.type,
        description: data.description,
        createdBy,
        fileUrl: data.fileUrl ?? null,
      },
    });

    return activity;
  },
};
