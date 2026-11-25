import express from "express";

import {
    createTelemetry,
    fetchTelemetry,
    fetchDeviceTelemetry
} from "../controllers/telemetryController.js";

const router = express.Router();

router.post("/", createTelemetry);

router.get("/", fetchTelemetry);

router.get("/:deviceId", fetchDeviceTelemetry);

export default router;