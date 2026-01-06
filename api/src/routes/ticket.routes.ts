import { Router } from "express";
import { ticketController } from "../controller/ticket.controller.js";

const router = Router();

router.get("/", ticketController);

export default router;
