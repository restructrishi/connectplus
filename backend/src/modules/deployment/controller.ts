import { Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import { deploymentService } from "./service";

export const getDeploymentSummary = async (_req: AuthenticatedRequest, res: Response) => {
  const summary = await deploymentService.getSummary();

  res.json({
    success: true,
    data: summary,
    message: "",
  });
};

export const getDeploymentStats = async (_req: AuthenticatedRequest, res: Response) => {
  const stats = await deploymentService.getStats();

  res.json({
    success: true,
    data: stats,
    message: "",
  });
};

export const listDeploymentProjects = async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(String(req.query.page ?? "1"), 10) || 1;
  const pageSize = parseInt(String(req.query.pageSize ?? "20"), 10) || 20;
  const status = (req.query.status as string | undefined) ?? null;
  const user = req.user;

  const result = await deploymentService.listProjects({
    page,
    pageSize,
    status,
    role: user?.role ?? "",
    userId: user?.id ?? 0,
  });

  res.json({
    success: true,
    data: result,
    message: "",
  });
};

export const createDeploymentProject = async (req: AuthenticatedRequest, res: Response) => {
  const body = req.body ?? {};
  const user = req.user;

  const project = await deploymentService.createProjectManual({
    linkedLeadId: body.linkedLeadId ?? null,
    linkedDealId: body.linkedDealId ?? null,
    clientName: body.clientName,
    clientAddress: body.clientAddress ?? null,
    assignedManagerId: body.assignedManagerId ?? String(user?.id ?? "system"),
    priority: body.priority,
    kickoffDate: body.kickoffDate ? new Date(body.kickoffDate) : null,
    expectedGoLive: body.expectedGoLive ? new Date(body.expectedGoLive) : null,
    notes: body.notes ?? null,
  });

  res.status(201).json({
    success: true,
    data: project,
    message: "",
  });
};

export const getDeploymentProject = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  const project = await deploymentService.getProjectById(id, {
    role: user?.role ?? "",
    userId: user?.id ?? 0,
  });

  if (!project) {
    res.status(404).json({
      success: false,
      data: null,
      message: "Deployment project not found",
    });
    return;
  }

  res.json({
    success: true,
    data: project,
    message: "",
  });
};

export const updateDeploymentProject = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};

  const updated = await deploymentService.updateProject(id, {
    clientName: body.clientName,
    clientAddress: body.clientAddress ?? null,
    assignedManagerId: body.assignedManagerId,
    status: body.status,
    priority: body.priority,
    kickoffDate: body.kickoffDate ? new Date(body.kickoffDate) : undefined,
    expectedGoLive: body.expectedGoLive ? new Date(body.expectedGoLive) : undefined,
    actualGoLive: body.actualGoLive ? new Date(body.actualGoLive) : undefined,
    goLiveSignoffUrl: body.goLiveSignoffUrl ?? undefined,
    notes: body.notes ?? undefined,
  });

  res.json({
    success: true,
    data: updated,
    message: "",
  });
};

export const getDeploymentStageLogs = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const logs = await deploymentService.getStageLogs(id);

  res.json({
    success: true,
    data: logs,
    message: "",
  });
};

export const advanceDeploymentStage = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  await deploymentService.advanceStage(
    id,
    body.newStage,
    user?.id ?? null,
    "manual_advance",
    body.notes ?? undefined,
  );

  res.status(204).json({
    success: true,
    data: null,
    message: "",
  });
};

export const getDeploymentTasks = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const tasks = await deploymentService.getTasks(id);

  res.json({
    success: true,
    data: tasks,
    message: "",
  });
};

export const getDeploymentTasksForEngineer = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(401).json({
      success: false,
      data: null,
      message: "Unauthorized",
    });
    return;
  }

  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const projectId = typeof req.query.projectId === "string" ? req.query.projectId : undefined;
  const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;

  const tasks = await deploymentService.getTasksForEngineer({
    userId: user.id,
    status,
    projectId,
    priority,
  });

  res.json({
    success: true,
    data: tasks,
    message: "",
  });
};

export const createDeploymentTask = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const task = await deploymentService.createTask(
    id,
    {
      title: body.title,
      description: body.description ?? null,
      stage: body.stage,
      assignedTo: body.assignedTo,
      assignedBy: body.assignedBy ?? String(user?.id ?? "system"),
      priority: body.priority,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
    user?.id ?? null,
  );

  res.status(201).json({
    success: true,
    data: task,
    message: "",
  });
};

export const updateDeploymentTask = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const taskId = req.params.taskId;
  const body = req.body ?? {};

  const updated = await deploymentService.updateTask(id, taskId, {
    title: body.title,
    description: body.description ?? null,
    stage: body.stage,
    assignedTo: body.assignedTo,
    priority: body.priority,
    status: body.status,
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
  });

  res.json({
    success: true,
    data: updated,
    message: "",
  });
};

export const completeDeploymentTask = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const taskId = req.params.taskId;
  const body = req.body ?? {};
  const user = req.user;

  const updated = await deploymentService.completeTask(
    id,
    taskId,
    {
      completionNote: body.completionNote ?? null,
      evidenceUrl: body.evidenceUrl ?? null,
    },
    user?.id ?? null,
  );

  res.json({
    success: true,
    data: updated,
    message: "",
  });
};

export const getDeploymentEngineers = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const engineers = await deploymentService.getEngineers(id);

  res.json({
    success: true,
    data: engineers,
    message: "",
  });
};

export const assignDeploymentEngineer = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const engineer = await deploymentService.assignEngineer(
    id,
    {
      userId: body.userId,
      role: body.role,
      assignedBy: body.assignedBy ?? String(user?.id ?? "system"),
    },
    user?.id ?? null,
  );

  res.status(201).json({
    success: true,
    data: engineer,
    message: "",
  });
};

export const removeDeploymentEngineer = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const engId = req.params.engId;
  const user = req.user;

  await deploymentService.removeEngineer(id, engId, user?.id ?? null);

  res.status(204).json({
    success: true,
    data: null,
    message: "",
  });
};

export const getDeploymentSiteSurvey = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const survey = await deploymentService.getSiteSurvey(id);

  res.json({
    success: true,
    data: survey,
    message: "",
  });
};

export const listDeploymentSiteSurveys = async (_req: AuthenticatedRequest, res: Response) => {
  const surveys = await deploymentService.listSiteSurveys();

  res.json({
    success: true,
    data: surveys,
    message: "",
  });
};

export const upsertDeploymentSiteSurvey = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};

  const survey = await deploymentService.upsertSiteSurvey(id, body);

  res.json({
    success: true,
    data: survey,
    message: "",
  });
};

export const completeDeploymentSiteSurvey = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  await deploymentService.completeSiteSurvey(id, user?.id ?? null);

  res.status(204).json({
    success: true,
    data: null,
    message: "",
  });
};

export const getDeploymentInfra = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const infra = await deploymentService.getInfra(id);

  res.json({
    success: true,
    data: infra,
    message: "",
  });
};

export const upsertDeploymentInfra = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};

  const infra = await deploymentService.upsertInfra(id, body);

  res.json({
    success: true,
    data: infra,
    message: "",
  });
};

export const completeDeploymentInfra = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const user = req.user;

  await deploymentService.completeInfra(id, user?.id ?? null);

  res.status(204).json({
    success: true,
    data: null,
    message: "",
  });
};

export const getDeploymentMaterials = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const materials = await deploymentService.getMaterials(id);

  res.json({
    success: true,
    data: materials,
    message: "",
  });
};

export const createDeploymentMaterialRequest = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const request = await deploymentService.createMaterialRequest(
    id,
    {
      items: body.items,
      requestedBy: body.requestedBy ?? String(user?.id ?? "system"),
      attachmentUrl: body.attachmentUrl ?? null,
    },
    user?.id ?? null,
  );

  res.status(201).json({
    success: true,
    data: request,
    message: "",
  });
};

export const updateDeploymentMaterialRequest = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const mrId = req.params.mrId;
  const body = req.body ?? {};
  const user = req.user;

  const updated = await deploymentService.updateMaterialRequest(
    id,
    mrId,
    {
      status: body.status,
      dispatchedAt: body.dispatchedAt ? new Date(body.dispatchedAt) : undefined,
      receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
    },
    user?.id ?? null,
  );

  res.json({
    success: true,
    data: updated,
    message: "",
  });
};

export const verifyDeploymentMaterial = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const mrId = req.params.mrId;
  const body = req.body ?? {};
  const user = req.user;

  const updated = await deploymentService.verifyMaterial(
    id,
    mrId,
    {
      verifiedBy: body.verifiedBy ?? String(user?.id ?? "system"),
    },
    user?.id ?? null,
  );

  res.json({
    success: true,
    data: updated,
    message: "",
  });
};

export const getDeploymentEmails = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const emails = await deploymentService.getEmails(id);

  res.json({
    success: true,
    data: emails,
    message: "",
  });
};

export const sendDeploymentEmail = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const email = await deploymentService.sendEmail(id, {
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

export const markDeploymentGoLive = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const project = await deploymentService.markGoLive(
    id,
    {
      goLiveSignoffUrl: body.goLiveSignoffUrl ?? null,
      actualGoLive: body.actualGoLive ? new Date(body.actualGoLive) : undefined,
    },
    user?.id ?? null,
  );

  res.json({
    success: true,
    data: project,
    message: "",
  });
};

export const getDeploymentActivities = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;

  const activities = await deploymentService.getActivities(id);

  res.json({
    success: true,
    data: activities,
    message: "",
  });
};

export const addDeploymentActivity = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  const body = req.body ?? {};
  const user = req.user;

  const activity = await deploymentService.addManualActivity(
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
