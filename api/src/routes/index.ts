import { Router } from "express";
import authRoutes from "./auth.routes.js";
import dbRoutes from "./db.routes.js";
import healthRoutes from "./health.routes.js";
import ticketRoutes from "./ticket.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/db", dbRoutes);
router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);

export default router;
