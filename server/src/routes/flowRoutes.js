
import express from "express";
import { executeFlow } from "../controllers/flowController.js";

const router = express.Router();

router.post("/execute", executeFlow);

export default router;
