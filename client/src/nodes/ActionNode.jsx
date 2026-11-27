
import React from "react";
import { Handle, Position } from "reactflow";

export default function ActionNode({ id, data }) {
    return (
        <div className="custom-node action-node">

            <Handle
                type="target"
                position={Position.Left}
            />

            <h3>Action Trigger</h3>

            <label>Threshold</label>

            <input
                className="nodrag"
                type="number"
                value={data.threshold}
                onChange={(e) =>
                    data.onChange(
                        id,
                        "threshold",
                        e.target.value
                    )
                }
            />

            <p>Trigger when value ≥ threshold</p>
        </div>
    );
}
