import Workflow from "../models/Workflow.js";
import ExecutionHistory from "../models/ExecutionHistory.js";
import { compileFlow } from "../services/flowCompiler.js";
import { validateFlow } from "../services/flowValidator.js";

export const saveWorkflow = async (req, res) => {
    try {
        const {
            name,
            description,
            nodes,
            edges
        } = req.body;

        validateFlow(nodes, edges);

        const workflow = await Workflow.create({
            name,
            description,
            nodes,
            edges
        });

        res.status(201).json({
            success: true,
            message: "Workflow saved successfully",
            workflow
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getWorkflows = async (req, res) => {
    try {
        const workflows = await Workflow.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: workflows.length,
            workflows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getWorkflowById = async (req, res) => {
    try {
        const workflow = await Workflow.findById(
            req.params.id
        );

        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: "Workflow not found"
            });
        }

        res.json({
            success: true,
            workflow
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.findByIdAndDelete(
            req.params.id
        );

        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: "Workflow not found"
            });
        }

        res.json({
            success: true,
            message: "Workflow deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const executeSavedWorkflow = async (req, res) => {
    const startTime = Date.now();
    let workflow;

    try {
        workflow = await Workflow.findById(
            req.params.id
        );

        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: "Workflow not found"
            });
        }

        validateFlow(workflow.nodes, workflow.edges);

        const results = await compileFlow(
            workflow.nodes,
            workflow.edges
        );

        const executionTime = Date.now() - startTime;

        await Workflow.findByIdAndUpdate(workflow._id, {
            $inc: { executionCount: 1 },
            $set: { lastExecutedAt: new Date() }
        });

        await ExecutionHistory.create({
            workflowId: workflow._id,
            status: "success",
            results,
            executionTime
        });

        res.json({
            success: true,
            executionTime,
            results
        });

    } catch (error) {
        if (workflow) {
            try {
                await ExecutionHistory.create({
                    workflowId: workflow._id,
                    status: "failed",
                    error: error.message,
                    executionTime: Date.now() - startTime
                });
            } catch (historyError) {
                console.error(historyError.message);
            }
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getExecutionHistory = async (req, res) => {
    try {
        const history = await ExecutionHistory.find({
            workflowId: req.params.id
        }).sort({ createdAt: -1 }).limit(100);

        res.json({
            success: true,
            history
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};