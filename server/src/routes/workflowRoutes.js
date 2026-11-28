import express from "express";

import {
    saveWorkflow,
    getWorkflows,
    getWorkflowById,
    deleteWorkflow,
    executeSavedWorkflow,
    getExecutionHistory
} from "../controllers/workflowController.js";

const router = express.Router();

router.post("/", saveWorkflow);

router.get("/", getWorkflows);

router.get("/:id", getWorkflowById);

router.delete("/:id", deleteWorkflow);

router.post("/:id/execute", executeSavedWorkflow);

router.get("/:id/history", getExecutionHistory);

export default router;