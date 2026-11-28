import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        nodes: {
            type: [mongoose.Schema.Types.Mixed],
            required: true
        },
        edges: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },
        executionCount: {
            type: Number,
            default: 0
        },
        lastExecutedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Workflow = mongoose.model(
    "Workflow",
    workflowSchema
);

export default Workflow;