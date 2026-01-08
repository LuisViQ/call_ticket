import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { upload } from "../middleware/upload.middleware.js";
import { uploadImageController } from "../controller/upload.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, upload.single("image"), uploadImageController);

router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  if (err instanceof Error) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  return res.status(500).json({ ok: false, error: "Upload failed" });
});

export default router;
