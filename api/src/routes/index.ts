import { Router } from "express";
import authRoutes from "./auth.routes.js";
import dbRoutes from "./db.routes.js";
import healthRoutes from "./health.routes.js";
import referenceRoutes from "./reference.routes.js";
import ticketRoutes from "./ticket.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/db", dbRoutes);
router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/", referenceRoutes);
router.use("/uploads", uploadRoutes);

export default router;
