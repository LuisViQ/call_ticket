import { Router } from "express";
import { dbTestController } from "../controller/db.controller.js";

const router = Router()


router.get("/", dbTestController);


export default router