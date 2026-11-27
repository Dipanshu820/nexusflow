
import React, { useCallback, useState } from "react";

import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState
} from "reactflow";

import "reactflow/dist/style.css";
import "./App.css";

import DataSourceNode from "./nodes/DataSourceNode";
import MathNode from "./nodes/MathNode";
import ActionNode from "./nodes/ActionNode";

const nodeTypes = {
    dataSource: DataSourceNode,
    math: MathNode,
    action: ActionNode
};

let nodeCounter = 0;

export default function App() {
    const [nodes, setNodes, onNodesChange] =
        useNodesState([]);

    const [edges, setEdges, onEdgesChange] =
        useEdgesState([]);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [instance, setInstance] = useState(null);

    const updateNodeData = useCallback(
        (id, field, value) => {
            setNodes((existingNodes) =>
                existingNodes.map((node) =>
                    node.id === id
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                [field]: value
                            }
                        }
                        : node
                )
            );
        },
        [setNodes]
    );

    const onConnect = useCallback(
        (connection) => {
            setEdges((existingEdges) =>
                addEdge(connection, existingEdges)
            );
        },
        [setEdges]
    );

    const createNode = (type, position) => {
        let data = {};

        if (type === "dataSource") {
            data = { value: 10 };
        } else if (type === "math") {
            data = {
                operation: "add",
                operand: 5
            };
        } else if (type === "action") {
            data = { threshold: 15 };
        } else {
            return;
        }

        const newNode = {
            id: `node-${++nodeCounter}`,
            type,
            position,
            data: {
                ...data,
                onChange: updateNodeData
            }
        };

        setNodes((previous) => [
            ...previous,
            newNode
        ]);
    };

    const onDragStart = (event, type) => {
        event.dataTransfer.setData(
            "application/reactflow",
            type
        );

        event.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const onDrop = (event) => {
        event.preventDefault();

        if (!instance) return;

        const type = event.dataTransfer.getData(
            "application/reactflow"
        );

        const position = instance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        });

        createNode(type, position);
    };

    const executeFlow = async () => {
        setLoading(true);
        setResult(null);

        try {
            const cleanNodes = nodes.map((node) => {
                const { onChange, ...data } = node.data;

                return {
                    id: node.id,
                    type: node.type,
                    data
                };
            });

            const response = await fetch(
                "http://localhost:5000/api/flows/execute",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nodes: cleanNodes,
                        edges
                    })
                }
            );

            const data = await response.json();

            setResult(data);

        } catch (error) {
            setResult({
                success: false,
                message: error.message
            });

        } finally {
            setLoading(false);
        }
    };

    const clearFlow = () => {
        setNodes([]);
        setEdges([]);
        setResult(null);
    };

    return (
        <div className="app-container">

            <header className="header">
                <h1>NexusFlow</h1>

                <div className="header-buttons">
                    <button
                        onClick={executeFlow}
                        disabled={loading}
                    >
                        {loading ? "Executing..." : "Execute Flow"}
                    </button>

                    <button onClick={clearFlow}>
                        Clear
                    </button>
                </div>
            </header>

            <div className="workspace">

                <aside className="sidebar">
                    <h2>Node Library</h2>

                    <div
                        className="library-node"
                        draggable
                        onDragStart={(e) =>
                            onDragStart(e, "dataSource")
                        }
                    >
                        Data Source
                    </div>

                    <div
                        className="library-node"
                        draggable
                        onDragStart={(e) =>
                            onDragStart(e, "math")
                        }
                    >
                        Math Operation
                    </div>

                    <div
                        className="library-node"
                        draggable
                        onDragStart={(e) =>
                            onDragStart(e, "action")
                        }
                    >
                        Action Trigger
                    </div>

                    <p>Drag nodes onto the workspace.</p>
                </aside>

                <main className="flow-area">

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>

                </main>

                <aside className="output-panel">
                    <h2>Execution Output</h2>

                    {result ? (
                        <pre>
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    ) : (
                        <p>No workflow executed yet.</p>
                    )}
                </aside>

            </div>
        </div>
    );
}
