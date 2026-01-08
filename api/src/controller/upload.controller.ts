import { Request, Response } from "express";
import path from "node:path";

export function uploadImageController(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ ok: false, error: "Image file is required" });
  }

  const relativePath = path.posix.join("uploads", file.filename);
  return res.status(201).json({
    ok: true,
    data: {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: relativePath,
      url: `/${relativePath}`
    }
  });
}
