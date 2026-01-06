import { Router } from "express";
import { loginController, meController } from "../controller/login.controller.js";

const router = Router();

router.post("/login", loginController);
router.get("/me", meController);

export default router;
