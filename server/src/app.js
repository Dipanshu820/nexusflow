import express from "express";
import cors from "cors";

import telemetryRoutes from "./routes/telemetryRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN ||
        "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {

    res.json({
        message: "Welcome to NexusFlow API"
    });

});

app.get("/api/health", (req, res) => {

    res.status(200).json({
        success: true,
        status: "Server is running"
    });

});

app.use("/api/telemetry", telemetryRoutes);

app.use(errorHandler);

export default app;