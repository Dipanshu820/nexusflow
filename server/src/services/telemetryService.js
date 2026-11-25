import Telemetry from "../models/Telemetry.js";

export const saveTelemetry = async (data) => {

    const telemetry = await Telemetry.create({

        metadata: {
            deviceId: data.deviceId,
            metric: data.metric
        },

        value: data.value,

        timestamp: data.timestamp || new Date()

    });

    return telemetry;
};

export const getAllTelemetry = async () => {

    return await Telemetry.find()
        .sort({ timestamp: -1 })
        .limit(100);
};

export const getDeviceTelemetry = async (deviceId) => {

    return await Telemetry.find({
        "metadata.deviceId": deviceId
    })
    .sort({ timestamp: -1 })
    .limit(100);
};