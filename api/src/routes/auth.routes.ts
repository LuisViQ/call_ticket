import { Router } from "express";
import { loginController } from "../controller/login.controller.js";

const router = Router();

router.post("/login", loginController);

router.get("/me", (req, res) => {
  return res.status(501).json({ error: "Not implemented" });
});

export default router;
