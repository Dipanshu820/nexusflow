
import React from "react";
import { Handle, Position } from "reactflow";

export default function MathNode({ id, data }) {
    return (
        <div className="custom-node math-node">

            <Handle
                type="target"
                position={Position.Left}
            />

            <h3>Math Operation</h3>

            <label>Operation</label>

            <select
                className="nodrag"
                value={data.operation}
                onChange={(e) =>
                    data.onChange(
                        id,
                        "operation",
                        e.target.value
                    )
                }
            >
                <option value="add">Addition</option>
                <option value="subtract">Subtraction</option>
                <option value="multiply">Multiplication</option>
                <option value="divide">Division</option>
            </select>

            <label>Operand</label>

            <input
                className="nodrag"
                type="number"
                value={data.operand}
                onChange={(e) =>
                    data.onChange(
                        id,
                        "operand",
                        e.target.value
                    )
                }
            />

            <Handle
                type="source"
                position={Position.Right}
            />
        </div>
    );
}
