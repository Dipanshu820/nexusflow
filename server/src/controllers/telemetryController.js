import {
    saveTelemetry,
    getAllTelemetry,
    getDeviceTelemetry
} from "../services/telemetryService.js";

export const createTelemetry = async (req, res, next) => {

    try {

        const { deviceId, metric, value, timestamp } = req.body || {};

        if (
            typeof deviceId !== "string" ||
            !deviceId.trim() ||
            typeof metric !== "string" ||
            !metric.trim() ||
            !Number.isFinite(value)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid telemetry data"
            });
        }

        if (
            timestamp !== undefined &&
            !Number.isFinite(new Date(timestamp).getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid timestamp"
            });
        }

        const data = await saveTelemetry(req.body);

        res.status(201).json({
            success: true,
            message: "Telemetry stored successfully",
            data: data
        });

    } catch (error) {
        next(error);
    }
};


export const fetchTelemetry = async (req, res, next) => {

    try {

        const data = await getAllTelemetry();

        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        next(error);
    }
};


export const fetchDeviceTelemetry = async (req, res, next) => {

    try {

        const deviceId = req.params.deviceId;

        const data = await getDeviceTelemetry(deviceId);

        res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {
        next(error);
    }
};