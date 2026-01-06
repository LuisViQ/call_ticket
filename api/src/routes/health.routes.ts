import { Router } from "express";
import { healthController } from "../controller/health.controller.js";

const router = Router();

router.get("/", healthController);

export default router;
