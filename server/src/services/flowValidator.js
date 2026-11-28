export function validateFlow(nodes, edges) {
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        throw new Error("Invalid workflow format");
    }

    if (nodes.length === 0) {
        throw new Error("Workflow cannot be empty");
    }

    const nodeMap = new Map();
    const adjacencyList = new Map();

    const validTypes = [
        "dataSource",
        "math",
        "action"
    ];

    for (const node of nodes) {
        if (!node.id || nodeMap.has(node.id)) {
            throw new Error("Invalid or duplicate node ID");
        }

        if (!validTypes.includes(node.type)) {
            throw new Error("Invalid node type");
        }

        nodeMap.set(node.id, node);
        adjacencyList.set(node.id, []);
    }

    for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);

        if (!source || !target) {
            throw new Error("Invalid connection");
        }

        if (source.id === target.id) {
            throw new Error("Self connection not allowed");
        }

        if (source.type === "action") {
            throw new Error("Action cannot have output");
        }

        if (target.type === "dataSource") {
            throw new Error("Data source cannot have input");
        }

        adjacencyList
            .get(edge.source)
            .push(edge.target);
    }

    const visited = new Set();
    const recursionStack = new Set();

    function detectCycle(nodeId) {
        if (recursionStack.has(nodeId)) {
            return true;
        }

        if (visited.has(nodeId)) {
            return false;
        }

        visited.add(nodeId);
        recursionStack.add(nodeId);

        for (const neighbour of adjacencyList.get(nodeId)) {
            if (detectCycle(neighbour)) {
                return true;
            }
        }

        recursionStack.delete(nodeId);
        return false;
    }

    for (const node of nodes) {
        if (detectCycle(node.id)) {
            throw new Error("Circular dependency detected");
        }
    }

    for (const node of nodes) {
        if (node.type !== "dataSource") {
            const inputs = edges.filter(
                edge => edge.target === node.id
            );

            if (inputs.length !== 1) {
                throw new Error(
                    `${node.id} requires exactly one input`
                );
            }
        }
    }

    if (!nodes.some(node => node.type === "action")) {
        throw new Error("Action node is required");
    }

    return true;
}