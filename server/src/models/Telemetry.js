import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema({

    metadata: {
        deviceId: {
            type: String,
            required: true,
            trim: true
        },

        metric: {
            type: String,
            required: true,
            trim: true
        }
    },

    value: {
        type: Number,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }

}, {

    timeseries: {
        timeField: "timestamp",
        metaField: "metadata",
        granularity: "seconds"
    },

    collection: "telemetry",
    autoCreate: false,
    autoIndex: false,
    versionKey: false

});

const Telemetry = mongoose.model(
    "Telemetry",
    telemetrySchema
);

export default Telemetry;