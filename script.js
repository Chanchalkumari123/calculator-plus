const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button");
const historyBox = document.getElementById("history");

let expression = "";

/* VALIDATION FUNCTION */
function isValidExpression(exp) {

    // empty check
    if (!exp) return false;

    // invalid operator sequence
    if (/[\+\-\*\/]{2,}/.test(exp)) return false;

    // start with operator (except -)
    if (/^[\+\*\/]/.test(exp)) return false;

    // end with operator
    if (/[\+\-\*\/]$/.test(exp)) return false;

    // bracket balance check
    let stack = [];
    for (let ch of exp) {
        if (ch === "(") stack.push(ch);
        if (ch === ")") {
            if (!stack.length) return false;
            stack.pop();
        }
    }
    if (stack.length !== 0) return false;

    return true;
}

/* INFIX TO POSTFIX */
function infixToPostfix(exp) {
    let stack = [];
    let output = [];

    let precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    };

    let tokens = exp.match(/\d+(\.\d+)?|[+\-*/()]/g);
    if (!tokens) return [];

    stack.push("(");
    tokens.push(")");

    for (let token of tokens) {

        if (!isNaN(token)) {
            output.push(token);
        }

        else if (token === "(") {
            stack.push(token);
        }

        else if (token === ")") {
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            stack.pop();
        }

        else {
            while (
                stack.length &&
                precedence[stack[stack.length - 1]] >= precedence[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    return output;
}

/* POSTFIX EVALUATION */
function evaluatePostfix(postfix) {
    let stack = [];

    for (let token of postfix) {

        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        }

        else {
            if (stack.length < 2) {
                throw "Invalid Expression";
            }

            let b = stack.pop();
            let a = stack.pop();

            let result;

            switch (token) {
                case "+": result = a + b; break;
                case "-": result = a - b; break;
                case "*": result = a * b; break;
                case "/":
                    if (b === 0) throw "Divide by zero";
                    result = a / b;
                    break;
            }

            stack.push(result);
        }
    }

    return stack.pop();
}

/* BUTTON HANDLING */
buttons.forEach(btn => {
    btn.addEventListener("click", () => {

        let value = btn.textContent;

        // EQUALS
        if (btn.id === "equals") {
            try {

                if (!isValidExpression(expression)) {
                    throw "Invalid Expression";
                }

                let postfix = infixToPostfix(expression);
                let result = evaluatePostfix(postfix);

                // multiple history lines
                historyBox.innerHTML += `<div>${expression} = ${result}</div>`;

                display.value = result;
                expression = result.toString();

            } catch {
                display.value = "Error";
                expression = "";
            }
        }

        // CLEAR
        else if (btn.id === "clear") {
            expression = "";
            display.value = "";
            historyBox.innerHTML = "";
        }

        // BACKSPACE
        else if (btn.id === "backspace") {
            expression = expression.slice(0, -1);
            display.value = expression;
        }

        // NORMAL INPUT
        else {
            expression += value;
            display.value = expression;
        }
    });
});