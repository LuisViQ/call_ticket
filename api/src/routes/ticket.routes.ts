import { Router } from "express";
import { ticketController } from "../controller/ticket.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:id", requireAuth, ticketController);
router.post("/", requireAuth, ticketController);
router.patch("/:id", requireAuth, ticketController);

export default router;
