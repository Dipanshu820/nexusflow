import { from, map, filter } from "rxjs";
import { performOperation } from "./mathService.js";

export const compileWorkflow = (nodes, sensorData) => {

    let stream = from(sensorData);

    for (const node of nodes) {

        if (node.type === "math") {

            stream = stream.pipe(

                map(value => {

                    return performOperation(
                        value,
                        node.data.operator,
                        node.data.operand
                    );

                })

            );

        }

        else if (node.type === "condition") {

            stream = stream.pipe(

                filter(value => {

                    const threshold = node.data.threshold;

                    switch (node.data.operator) {

                        case ">":
                            return value > threshold;

                        case "<":
                            return value < threshold;

                        case "==":
                            return value === threshold;

                        case ">=":
                            return value >= threshold;

                        case "<=":
                            return value <= threshold;

                        default:
                            throw new Error("Invalid condition");
                    }

                })

            );

        }

    }

    return stream;
};