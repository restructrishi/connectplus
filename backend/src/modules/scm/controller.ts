import { Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import { scmService } from "./service";

export const getScmSummary = async (_req: AuthenticatedRequest, res: Response) => {
  const summary = await scmService.getSummary();

  res.json({
    success: true,
    data: { summary },
    message: "",
  });
};

export const getScmStats = async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await scmService.getStats();

  res.json({
    success: true,
    data: { stats },
    message: "",
  });
};

export const listScmOrders = async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(String(req.query.page ?? "1"), 10) || 1;
  const pageSize = parseInt(String(req.query.pageSize ?? "20"), 10) || 20;
  const stage = (req.query.stage as string | undefined) ?? null;
  const status = (req.query.status as string | undefined) ?? null;
  const assignedTo = (req.query.assignedTo as string | undefined) ?? null;

  const user = req.user;

  const result = await scmService.listOrders({
    page,
    pageSize,
    role: user?.role ?? "",
    userId: user?.id ?? 0,
    stage,
    status,
    assignedTo,
  });

  res.json({
    success: true,
    data: result,
    message: "",
  });
};

export const createScmOrder = async (req: AuthenticatedRequest, res: Response) => {
  const body = req.body ?? {};

  const order = await scmService.createOrderManual({
    linkedLeadId: body.linkedLeadId ?? null,
    linkedDealId: body.linkedDealId ?? null,
    clientName: body.clientName,
    clientAddress: body.clientAddress ?? null,
    assignedTo: body.assignedTo,
    priority: body.priority,
    estimatedValue: body.estimatedValue ?? null,
    expectedDelivery: body.expectedDelivery ? new Date(body.expectedDelivery) : null,
    notes: body.notes ?? null,
  });

  res.status(201).json({
    success: true,
    data: order,
    message: "",
  });
};

export const getScmOrder = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  const order = await scmService.getOrderById(id, {
    role: user?.role ?? "",
    userId: user?.id ?? 0,
  });

  if (!order) {
    res.status(404).json({
      success: false,
      data: null,
      message: "SCM order not found",
    });
    return;
  }

  res.json({
    success: true,
    data: order,
    message: "",
  });
};

export const getScmActivities = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const items = await scmService.getActivities(id);

  res.json({
    success: true,
    data: items,
    message: "",
  });
};

export const updateScmOrder = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};

  const updated = await scmService.updateOrder(id, {
    clientName: body.clientName,
    clientAddress: body.clientAddress,
    assignedTo: body.assignedTo,
    status: body.status,
    priority: body.priority,
    estimatedValue: body.estimatedValue,
    expectedDelivery: body.expectedDelivery ? new Date(body.expectedDelivery) : null,
    notes: body.notes,
  });

  res.json({
    success: true,
    data: updated,
    message: "",
  });
};

export const getScmStageLogs = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const logs = await scmService.getStageLogs(id);

  res.json({
    success: true,
    data: logs,
    message: "",
  });
};

export const advanceScmStage = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const body = req.body ?? {};

  await scmService.advanceStage(id, body.stage, user?.id ?? null, "manual_advance", body.notes);

  res.json({
    success: true,
    data: null,
    message: "",
  });
};

export const getScmProcurement = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const record = await scmService.getProcurement(id);

  res.json({
    success: true,
    data: record,
    message: "",
  });
};

export const upsertScmProcurement = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const body = req.body ?? {};

  const record = await scmService.upsertProcurement(id, body, user?.id ?? null);

  res.json({
    success: true,
    data: record,
    message: "",
  });
};

export const sendScmProcurementPo = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  await scmService.sendProcurementPo(id, user?.id ?? null);

  res.json({
    success: true,
    data: null,
    message: "",
  });
};

export const getScmWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const record = await scmService.getWarehouse(id);

  res.json({
    success: true,
    data: record,
    message: "",
  });
};

export const upsertScmWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const record = await scmService.upsertWarehouse(id, body, user?.id ?? null);

  res.json({
    success: true,
    data: record,
    message: "",
  });
};

export const confirmScmWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  await scmService.confirmWarehouseReceipt(id, user?.id ?? null);

  res.json({
    success: true,
    data: null,
    message: "",
  });
};

export const getScmDispatch = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const record = await scmService.getDispatch(id);

  res.json({
    success: true,
    data: record,
    message: "",
  });
};

export const upsertScmDispatch = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const record = await scmService.upsertDispatch(id, body, user?.id ?? null);

  res.json({
    success: true,
    data: record,
    message: "",
  });
};

export const confirmScmDispatch = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const body = req.body ?? {};

  await scmService.confirmDispatchDelivery(id, body, user?.id ?? null);

  res.json({
    success: true,
    data: null,
    message: "",
  });
};

export const getScmDocuments = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const docs = await scmService.getDocuments(id);

  res.json({
    success: true,
    data: docs,
    message: "",
  });
};

export const uploadScmDocument = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const body = req.body ?? {};
  const file = req.file as Express.Multer.File | undefined;

  const fileUrl = body.fileUrl || (file ? `/scm-uploads/${encodeURIComponent(file.originalname)}` : "");

  const doc = await scmService.addDocument(id, {
    type: body.type,
    name: body.name || (file ? file.originalname : "Uploaded document"),
    fileUrl,
    uploadedBy: user ? String(user.id) : "system",
  });

  res.status(201).json({
    success: true,
    data: doc,
    message: "",
  });
};

export const shareScmDocuments = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const body = req.body ?? {};

  const documentIds = (body.documentIds as string[]) ?? [];
  const accountsEmail = body.accountsEmail || null;

  await scmService.shareDocuments(id, documentIds, accountsEmail, user?.id ?? null);

  res.json({
    success: true,
    data: null,
    message: "",
  });
};

export const getScmExpenses = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const items = await scmService.getExpenses(id);

  res.json({
    success: true,
    data: items,
    message: "",
  });
};

export const addScmExpense = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};

  const expense = await scmService.addExpense(id, body);

  res.status(201).json({
    success: true,
    data: expense,
    message: "",
  });
};

export const updateScmExpenseStatus = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const expenseId = req.params.expId;
  const body = req.body ?? {};
  const user = req.user;

  const result = await scmService.updateExpenseStatus(id, expenseId, body.status, user ? String(user.id) : null);

  res.json({
    success: true,
    data: result,
    message: "",
  });
};

export const addScmManualActivity = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const activity = await scmService.addManualActivity(
    id,
    {
      type: body.type,
      description: body.description,
      fileUrl: body.fileUrl ?? null,
    },
    user?.id ?? null,
  );

  res.status(201).json({
    success: true,
    data: activity,
    message: "",
  });
};

export const getScmEmails = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const items = await scmService.getEmails(id);

  res.json({
    success: true,
    data: items,
    message: "",
  });
};

export const sendScmEmail = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const email = await scmService.sendEmail(id, {
    to: body.to ?? [],
    cc: body.cc ?? [],
    subject: body.subject,
    body: body.body,
    sentBy: user ? String(user.id) : "system",
    type: body.type,
  });

  res.status(201).json({
    success: true,
    data: email,
    message: "",
  });
};

export const completeScmOrder = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  const order = await scmService.completeOrder(id, user?.id ?? null);

  res.json({
    success: true,
    data: order,
    message: "",
  });
};
