import { useCallback } from "react";

import {
    ReactFlow,
    ReactFlowProvider,
    Controls,
    Background,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./App.css";

const initialNodes = [];

const initialEdges = [];

const nodeTypes = [
    { label: "Temperature Sensor", type: "input" },
    { label: "Humidity Sensor", type: "input" },
    { label: "Pressure Sensor", type: "input" },
    { label: "Condition", type: "default" },
    { label: "Filter", type: "default" },
    { label: "Alert", type: "output" },
    { label: "Action", type: "output" }
];

function FlowEditor() {

    const [nodes, setNodes, onNodesChange] =
        useNodesState(initialNodes);

    const [edges, setEdges, onEdgesChange] =
        useEdgesState(initialEdges);

    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback(

        (params) => {

            setEdges((edges) =>
                addEdge(params, edges)
            );

        },

        [setEdges]

    );

    const onDragStart = (event, node) => {

        event.dataTransfer.setData(
            "application/nexusflow",
            JSON.stringify(node)
        );

        event.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (event) => {

        event.preventDefault();

        event.dataTransfer.dropEffect = "move";
    };

    const onDrop = (event) => {

        event.preventDefault();

        const data = event.dataTransfer.getData(
            "application/nexusflow"
        );

        if (!data) {
            return;
        }

        const node = JSON.parse(data);

        const position = screenToFlowPosition({

            x: event.clientX,

            y: event.clientY

        });

        const newNode = {

            id: crypto.randomUUID(),

            type: node.type,

            position,

            data: {
                label: node.label
            }

        };

        setNodes((nodes) => nodes.concat(newNode));
    };

    const clearCanvas = () => {

        setNodes([]);

        setEdges([]);

    };

    return (

        <div className="app">

            <header className="header">

                <h1>NexusFlow</h1>

                <p>Visual IoT Telemetry & Rule Engine</p>

            </header>

            <div className="workspace">

                <aside className="sidebar">

                    <h2>Node Library</h2>

                    <p>Drag nodes onto the canvas</p>

                    {nodeTypes.map((node) => (

                        <div
                            key={node.label}
                            className="node-item"
                            draggable

                            onDragStart={(event) =>
                                onDragStart(event, node)
                            }
                        >

                            {node.label}

                        </div>

                    ))}

                    <button
                        className="clear-button"
                        onClick={clearCanvas}
                    >

                        Clear Canvas

                    </button>

                </aside>

                <div className="flow-container">

                    <ReactFlow

                        nodes={nodes}

                        edges={edges}

                        onNodesChange={onNodesChange}

                        onEdgesChange={onEdgesChange}

                        onConnect={onConnect}

                        onDragOver={onDragOver}

                        onDrop={onDrop}

                        fitView

                    >

                        <Background />

                        <Controls />

                        <MiniMap />

                    </ReactFlow>

                </div>

            </div>

        </div>

    );
}

export default function App() {

    return (

        <ReactFlowProvider>

            <FlowEditor />

        </ReactFlowProvider>

    );
}