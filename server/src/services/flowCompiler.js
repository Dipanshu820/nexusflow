
import { of, map, lastValueFrom } from "rxjs";

export async function compileFlow(nodes, edges) {
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        throw new Error("Invalid flow data");
    }

    const nodeMap = new Map();
    const streams = new Map();
    const visiting = new Set();

    nodes.forEach((node) => {
        nodeMap.set(node.id, node);
    });

    function buildStream(nodeId) {
        if (streams.has(nodeId)) {
            return streams.get(nodeId);
        }

        if (visiting.has(nodeId)) {
            throw new Error("Circular connection detected");
        }

        const node = nodeMap.get(nodeId);

        if (!node) {
            throw new Error("Node not found");
        }

        visiting.add(nodeId);

        let stream;

        if (node.type === "dataSource") {
            const value = Number(node.data.value);

            if (!Number.isFinite(value)) {
                throw new Error("Invalid data source value");
            }

            stream = of(value);
        } else {
            const incoming = edges.filter(
                (edge) => edge.target === nodeId
            );

            if (incoming.length !== 1) {
                throw new Error(
                    "Each operation must have exactly one input"
                );
            }

            const inputStream = buildStream(
                incoming[0].source
            );

            if (node.type === "math") {
                const operation = node.data.operation;
                const operand = Number(node.data.operand);

                if (!Number.isFinite(operand)) {
                    throw new Error("Invalid operand");
                }

                stream = inputStream.pipe(
                    map((value) => {
                        switch (operation) {
                            case "add":
                                return value + operand;

                            case "subtract":
                                return value - operand;

                            case "multiply":
                                return value * operand;

                            case "divide":
                                if (operand === 0) {
                                    throw new Error(
                                        "Division by zero"
                                    );
                                }

                                return value / operand;

                            default:
                                throw new Error(
                                    "Invalid operation"
                                );
                        }
                    })
                );
            } else if (node.type === "action") {
                const threshold = Number(
                    node.data.threshold
                );

                if (!Number.isFinite(threshold)) {
                    throw new Error("Invalid threshold");
                }

                stream = inputStream.pipe(
                    map((value) => ({
                        value,
                        threshold,
                        triggered: value >= threshold,
                        message:
                            value >= threshold
                                ? "Action Triggered"
                                : "Condition Not Met"
                    }))
                );
            } else {
                throw new Error("Unknown node type");
            }
        }

        visiting.delete(nodeId);
        streams.set(nodeId, stream);

        return stream;
    }

    const actionNodes = nodes.filter(
        (node) => node.type === "action"
    );

    if (actionNodes.length === 0) {
        throw new Error("Add at least one action node");
    }

    const results = [];

    for (const node of actionNodes) {
        const stream = buildStream(node.id);
        const result = await lastValueFrom(stream);

        results.push({
            nodeId: node.id,
            result
        });
    }

    return results;
}
