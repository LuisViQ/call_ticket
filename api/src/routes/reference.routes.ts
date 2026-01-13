import { Router } from "express";
import { areaTypesController, ticketTypesController } from "../controller/reference.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/ticket-types", requireAuth, ticketTypesController);
router.get("/area-types", requireAuth, areaTypesController);

export default router;
