
import { compileFlow } from "../services/flowCompiler.js";

export const executeFlow = async (req, res) => {
    try {
        const { nodes, edges } = req.body;

        const results = await compileFlow(nodes, edges);

        return res.status(200).json({
            success: true,
            message: "Workflow executed successfully",
            results
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
