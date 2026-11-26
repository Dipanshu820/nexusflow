import { compileWorkflow } from "./services/logicCompiler.js";

const sensorData = [10, 20, 30, 40, 50];

const nodes = [

    {
        type: "math",
        data: {
            operator: "multiply",
            operand: 2
        }
    },

    {
        type: "condition",
        data: {
            operator: ">",
            threshold: 50
        }
    }

];

const result = compileWorkflow(nodes, sensorData);

result.subscribe({

    next: value => console.log("Result:", value),

    error: error => console.log(error.message),

    complete: () => console.log("Workflow completed")

});