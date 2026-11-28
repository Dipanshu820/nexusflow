import mongoose from "mongoose";

const executionHistorySchema = new mongoose.Schema(
    {
        workflowId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workflow",
            default: null
        },
        status: {
            type: String,
            enum: ["success", "failed"],
            required: true
        },
        results: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },
        error: {
            type: String,
            default: ""
        },
        executionTime: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "ExecutionHistory",
    executionHistorySchema
);