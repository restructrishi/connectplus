import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import * as ctrl from "./orgCrm.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/crm-contacts", ctrl.listContacts);
router.post("/crm-contacts", ctrl.createContact);
router.get("/crm-contacts/:id", ctrl.getContact);

router.get("/crm-deals", ctrl.listDeals);
router.post("/crm-deals", ctrl.createDeal);
router.get("/crm-deals/:id", ctrl.getDeal);

export { router as orgCrmRoutes };
