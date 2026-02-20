import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { crmRoutes } from "./modules/crm/routes.js";
import { proxyRoutes } from "./modules/proxy/proxy.routes.js";
import { employeesRoutes } from "./modules/employees/employees.routes.js";
import { lifecycleRoutes } from "./modules/sales-lifecycle/routes.js";
import { pipelineRoutes } from "./modules/pipeline/pipeline.routes.js";
import { scmRoutes } from "./modules/scm/scm.routes.js";
import { deploymentRoutes } from "./modules/deployment/deployment.routes.js";
import { preSalesRoutes } from "./modules/preSales/preSales.routes.js";
import { dataAiRoutes } from "./modules/dataAi/dataAi.routes.js";
import { cloudRoutes } from "./modules/cloud/cloud.routes.js";
import { legalRoutes } from "./modules/legal/legal.routes.js";
import { orgCrmRoutes } from "./modules/orgCrm/orgCrm.routes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: { success: false, message: "Too many requests" },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health
app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

// API
app.use("/api/auth", authRoutes);
app.use("/api/proxy", proxyRoutes);
app.use("/api", employeesRoutes);
app.use("/api", lifecycleRoutes);
app.use("/api", pipelineRoutes);
app.use("/api", scmRoutes);
app.use("/api", deploymentRoutes);
app.use("/api", preSalesRoutes);
app.use("/api", dataAiRoutes);
app.use("/api", cloudRoutes);
app.use("/api", legalRoutes);
app.use("/api", orgCrmRoutes);
app.use("/api", crmRoutes);

app.use(errorHandler);

export default app;
