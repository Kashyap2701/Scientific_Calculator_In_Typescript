"use strict";
const curInput = document.getElementById("cal-input");
const display = document.getElementById("display-expression");
const digits = document.getElementsByClassName("digits")[0];
const operators = document.getElementsByClassName("operators")[0];
const calculatorButtons = document.getElementById("calculator-btns");
const mathFunctions = document.getElementById("maths-functions");
const degToRed = document.getElementById('toggle-angle');
const memoryButtons = document.getElementById('memory-buttons');
const equalButton = document.getElementById("equal-to");
const errorContainer = document.getElementById('error-container');
const flipColumn = document.getElementById('flipColumn');
const FEButton = document.getElementById('F-E');
const dropDown = document.getElementsByClassName('dropdown');
const dropDownItems = document.getElementsByClassName('dropdown-items');
const PI = "\u03C0";
// ----------------------------- Utility Classes ------------------------
class Calculator {
    constructor() {
        this.angleInDegree = true;
        this.isCalculatorInputAdd = false;
        this.isEvaluated = false;
        this.actualExpression = '';
        display.value = '';
        curInput.value = '';
    }
    static clearLastInput() {
        curInput.value = curInput.value.slice(0, -1);
    }
    static resetCalculator() {
        curInput.value = '';
        display.value = '';
    }
    showError(errorMessage) {
        errorContainer.style.display = 'flex';
        errorContainer.firstElementChild.innerText = errorMessage;
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 3000);
    }
    static splitsByOperator(expression) {
        // list of operators to split by
        const operators = ["+", "*", "-", "/", "(", ")", "%", "^", PI];
        // store current multi-digit number
        let currentNumber = "";
        // array to store the parts of the expression
        const parts = [];
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            if (operators.includes(char)) {
                // if the character is an operator
                if (currentNumber !== "") {
                    // add it to the parts array
                    parts.push(currentNumber);
                    // reset the current number variable
                    currentNumber = "";
                }
                parts.push(char); // add the operator to the parts array
            }
            else {
                // add the digit to the current number
                currentNumber += char;
                if (i === expression.length - 1) {
                    // add the current number to the parts array
                    parts.push(currentNumber);
                }
            }
        }
        // now seprate the negative value in expression
        for (let item = 0; item < parts.length; item++) {
            // if part is "-" symbol
            if (parts[item] == "-") {
                if ((Number(item) == 0 && parts[Number(item) + 1] != "(") ||
                    parts[Number(item) - 1] == "(" ||
                    (isNaN(Number(parts[Number(item) - 1])) && parts[Number(item) - 1] != ")")) {
                    let x = parts[item];
                    let y = parts[Number(item) + 1];
                    let temp = x + y;
                    parts.splice(Number(item), 2, temp);
                }
                if (parts[item] == "-(") {
                    parts.splice(Number(item), 1, "-", "(");
                }
            }
        }
        return parts;
    }
    infixToPrefix(str) {
        let expression = Calculator.splitsByOperator(str).reverse();
        // Create an empty stack and an empty result string
        let stack = [];
        let result = "";
        for (let i = 0; i < expression.length; i++) {
            let c = expression[i];
            let n = expression[i];
            if (c.match(/[a-z0-9]/i)) {
                result += c + " ";
            }
            else if (c === ")") {
                stack.push(c);
            }
            else if (c === PI) {
                result += Math.PI + " ";
            }
            else if (c === "+" ||
                c === "-" ||
                c === "*" ||
                c === "/" ||
                c === "(" ||
                c === "%" ||
                c === "^") {
                while (stack.length > 0 &&
                    stack[stack.length - 1] !== ")" &&
                    this.precedence(c) < this.precedence(stack[stack.length - 1])) {
                    result += stack.pop() + " ";
                }
                stack.push(c);
            }
        }
        while (stack.length > 0) {
            result += stack.pop() + " ";
        }
        return result.split(" ").slice(0, -1).reverse().join(" ");
    }
    precedence(operator) {
        if (operator === "+" || operator === "-") {
            return 1;
        }
        else if (operator === "*" || operator === "/" || operator === "%") {
            return 2;
        }
        else if (operator === "^") {
            return 3;
        }
        else {
            return 0;
        }
    }
    evaluate(expression) {
        let tokens = expression.split(" ");
        let stack = [];
        for (let i = tokens.length - 1; i >= 0; i--) {
            let token = tokens[i];
            if (token.match(/[0-9]/i)) {
                stack.push(parseFloat(token));
            }
            else if (token.match(PI)) {
                stack.push(Math.PI);
            }
            else if (token === "+" ||
                token === "-" ||
                token === "*" ||
                token === "/" ||
                token === "%" ||
                token === "^") {
                let operand1 = stack.pop();
                ;
                let operand2 = stack.pop();
                let result = 0;
                switch (token) {
                    case "+":
                        result = operand1 + operand2;
                        break;
                    case "-":
                        // if(operand1 && operand2)
                        result = operand1 - operand2;
                        // else
                        //   result = operand1*-1;
                        break;
                    case "*":
                        result = operand1 * operand2;
                        break;
                    case "/":
                        result = operand1 / operand2;
                        break;
                    case "%":
                        result = operand1 % operand2;
                        break;
                    case "^":
                        result = Math.pow(operand1, operand2);
                }
                console.log('result' + result);
                stack.push(result);
            }
            console.log('stack' + stack);
        }
        return stack.pop();
    }
    calculate(exp) {
        if (exp) {
            return this.evaluate(this.infixToPrefix(exp));
        }
        return this.evaluate(this.infixToPrefix(this.actualExpression));
    }
    clearExpression() {
        this.actualExpression = '';
    }
}
class InputDisplay extends Calculator {
    static setInput(input) {
        curInput.value += input;
        curInput.focus();
    }
    ;
    static getInput() {
        return curInput.value;
    }
    static getLastValue() {
        return this.splitsByOperator(curInput.value).slice(-1)[0];
    }
    static isExpression() {
        if (curInput.value.includes('(') || curInput.value.includes(')'))
            return true;
        return false;
    }
    static checklastValueOperator() {
        const op = InputDisplay.getLastValue();
        if (op == '+' || op == '-' || op == '%' || op == '*' || op == '/' || op == '^')
            return true;
        return false;
    }
    static clear() {
        curInput.value = '';
    }
}
class Memory {
    static storeNumber(num) {
        this.accumlator = num;
    }
    static addNumber(num) {
        this.accumlator += num;
    }
    static subtractNumber(num) {
        this.accumlator -= num;
    }
    static clearNumber() {
        this.accumlator = 0;
    }
    static getNumber() {
        return this.accumlator;
    }
}
Memory.accumlator = 0;
const c = new Calculator();
// ----------------------------- Utility Functions ------------------------
// Trigonometry Functions and Maths Functions
for (let i = 0; i < dropDownItems.length; i++) {
    dropDownItems[i].addEventListener('click', utilityDropdownFunctions);
}
function utilityDropdownFunctions(e) {
    let target = ['sin', 'cos', 'tan', 'cot', 'sec', 'cosec', 'ceil', 'floor', 'abs'];
    let operator = ['+', '-', '=', '%', '^', "*", "/"];
    let angleValue = c.angleInDegree ? parseFloat(curInput.value) : c.calculate(curInput.value);
    let curDigit = parseFloat(curInput.value);
    if (curInput.value) {
        // if event target include the valid target
        if (target.includes(e.target.value)) {
            // if display value doesn't contain equal
            if (display.value && !operator.some((op) => display.value.includes(op)))
                // eg. sin(cos(9)) is possible
                display.value = `${e.target.value}(${display.value})`;
            else if (display.value.includes("=")) {
                display.value = `${e.target.value}(${curInput.value})`;
            }
            else
                display.value += `${e.target.value}(${curInput.value})`;
        }
        switch (e.target.value) {
            case "sin":
                curDigit = c.angleInDegree ? Math.sin(angleValue * (3.1415926 / 180)) : Math.sin(angleValue);
                break;
            case "cos":
                curDigit = c.angleInDegree ? Math.cos(angleValue * (3.1415926 / 180)) : Math.cos(angleValue);
                break;
            case "tan":
                curDigit = c.angleInDegree ? Math.tan(angleValue * (3.1415926 / 180)) : Math.tan(angleValue);
                break;
            case "cot":
                curDigit = c.angleInDegree ? (1 / Math.tan(angleValue * (3.1415926 / 180))) : (1 / Math.tan(angleValue));
                break;
            case "sec":
                curDigit = c.angleInDegree ? (1 / Math.cos(angleValue * (3.1415926 / 180))) : (1 / Math.cos(angleValue));
                break;
            case "cosec":
                curDigit = c.angleInDegree ? (1 / Math.sin(angleValue * (3.1415926 / 180))) : (1 / Math.cos(angleValue));
                break;
            case "ceil":
                curDigit = Math.ceil(curDigit);
                break;
            case "floor":
                curDigit = Math.floor(curDigit);
                break;
            case "abs":
                curDigit = Math.abs(curDigit);
                break;
        }
        c.actualExpression += curDigit.toFixed(5).toString();
        c.isCalculatorInputAdd = true;
        curInput.value = curDigit.toFixed(5);
    }
}
// Dropdowns for Trigonometry and Functions
for (let i = 0; i < dropDown.length; i++) {
    dropDown[i].addEventListener('click', toggleDropDown);
}
function toggleDropDown(e) {
    if (e.target.tagName == 'BUTTON')
        e.target.nextElementSibling.style.display == "none"
            ? (e.target.nextElementSibling.style.display = "flex")
            : (e.target.nextElementSibling.style.display = "none");
}
// function check parenthenses
function isBalanced(str) {
    const stack = [];
    // Iterate over each character in the string
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        // If the character is an opening parenthesis, push it onto the stack
        if (char === '(') {
            stack.push(char);
        }
        // If the character is a closing parenthesis, pop the last opening parenthesis from the stack
        else if (char === ')') {
            if (stack.length === 0) {
                return false; // Stack is empty, no opening parenthesis to match
            }
            else {
                stack.pop();
            }
        }
        // Ignore all other characters
    }
    // If the stack is empty, all parentheses are balanced
    return stack.length === 0;
}
// Find the Fectorial Number
function fact(number) {
    let fact = 1;
    for (let i = number; i >= 1; i--) {
        fact = fact * i;
    }
    return fact;
}
