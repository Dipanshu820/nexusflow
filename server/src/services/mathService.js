export const performOperation = (value, operator, operand) => {

    if (!Number.isFinite(value) || !Number.isFinite(operand)) {
        throw new Error("Invalid numeric value");
    }

    switch (operator) {

        case "add":
            return value + operand;

        case "subtract":
            return value - operand;

        case "multiply":
            return value * operand;

        case "divide":

            if (operand === 0) {
                throw new Error("Division by zero");
            }

            return value / operand;

        default:
            throw new Error("Invalid operation");
    }
};