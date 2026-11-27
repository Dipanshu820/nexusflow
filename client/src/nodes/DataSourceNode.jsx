
import React from "react";
import { Handle, Position } from "reactflow";

export default function DataSourceNode({ id, data }) {
    return (
        <div className="custom-node source-node">
            <h3>Data Source</h3>

            <label>Input Value</label>

            <input
                className="nodrag"
                type="number"
                value={data.value}
                onChange={(e) =>
                    data.onChange(id, "value", e.target.value)
                }
            />

            <Handle
                type="source"
                position={Position.Right}
            />
        </div>
    );
}
