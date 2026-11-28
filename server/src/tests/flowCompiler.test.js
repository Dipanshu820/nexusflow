import test from "node:test";
import assert from "node:assert/strict";

import { compileFlow } from "../src/services/flowCompiler.js";
import { validateFlow } from "../src/services/flowValidator.js";

const nodes = [
    {
        id: "1",
        type: "dataSource",
        data: { value: 20 }
    },
    {
        id: "2",
        type: "math",
        data: {
            operation: "multiply",
            operand: 5
        }
    },
    {
        id: "3",
        type: "action",
        data: { threshold: 80 }
    }
];

const edges = [
    { source: "1", target: "2" },
    { source: "2", target: "3" }
];

test("Valid workflow", () => {
    assert.equal(
        validateFlow(nodes, edges),
        true
    );
});

test("Math multiplication", async () => {
    const results = await compileFlow(nodes, edges);

    assert.equal(
        results[0].result.value,
        100
    );
});

test("Action trigger", async () => {
    const results = await compileFlow(nodes, edges);

    assert.equal(
        results[0].result.triggered,
        true
    );
});

test("Invalid connection", () => {
    assert.throws(() => {
        validateFlow(nodes, [
            { source: "1", target: "99" }
        ]);
    });
});

test("Empty workflow", () => {
    assert.throws(() => {
        validateFlow([], []);
    });
});

test("Division by zero", async () => {
    const updatedNodes = structuredClone(nodes);

    updatedNodes[1].data.operation = "divide";
    updatedNodes[1].data.operand = 0;

    await assert.rejects(
        compileFlow(updatedNodes, edges),
        /Division by zero/
    );
});

test("Threshold not reached", async () => {
    const updatedNodes = structuredClone(nodes);

    updatedNodes[2].data.threshold = 200;

    const results = await compileFlow(
        updatedNodes,
        edges
    );

    assert.equal(
        results[0].result.triggered,
        false
    );
});