import { Request, Response } from "express";
import pool from "../database/pool.js";

export async function dbTestController(req: Request, res: Response) {
  try {
    const [rows] = await pool.query("SELECT 1 AS alive");
    const list = rows as Array<{ alive: number }>;
    const data = list.length ? list[0] : { alive: 1 };
    return res.status(200).json({ data });
  } catch (error) {
    console.error("DB health check failed", error);
    return res.status(500).json({ error: "Database unavailable" });
  }
}
