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
// ------------------------- Event Listnerer ---------------------------------
// fixed decimal and exponential format
FEButton.addEventListener("click", () => {
    if (curInput.value) {
        curInput.value = Number(curInput.value).toExponential(2);
        c.actualExpression += Number(curInput.value) * Math.pow(10, 2);
        display.value.includes("=") ? display.value = `(${curInput.value})` : display.value += `(${curInput.value})`;
        c.isCalculatorInputAdd = true;
    }
});
degToRed.addEventListener('click', () => {
    let AngleText = degToRed.innerText;
    if (AngleText === "DEG") {
        degToRed.innerText = "RAD";
        c.angleInDegree = false;
    }
    else {
        degToRed.innerText = "DEG";
        c.angleInDegree = true;
    }
});
digits.addEventListener('click', (e) => {
    let digitButton = e.target;
    if (digitButton.tagName === "BUTTON") {
        if (digitButton.value === "-") {
            let exp = Calculator.splitsByOperator(curInput.value).slice(0, -1).join("");
            let number = Calculator.splitsByOperator(curInput.value).slice(-1).join("");
            if (!isNaN(Number(curInput.value)))
                curInput.value = (Number(number) * -1).toString();
            else {
                if (exp.charAt(exp.length - 1) == "-") {
                    curInput.value = `${exp.slice(0, -1)}+${number}`;
                }
                else if (exp.charAt(exp.length - 1) == "+") {
                    curInput.value = `${exp.slice(0, -1)}${Number(number) * -1}`;
                }
                else if (number == ")" && exp.charAt(0) == "(") {
                    curInput.value = `-${exp}${number}`;
                }
                else if (number == ")" && exp.charAt(0) == "-") {
                    curInput.value = `${exp.slice(1)}${number}`;
                }
                else if (!isNaN(Number(number))) {
                    curInput.value = `${exp}${Number(number) * -1}`;
                }
                else {
                    c.showError('Check your expression');
                }
            }
        }
        else if (digitButton.value === ".") {
            curInput.value +=
                curInput.value.includes(".") && Calculator.splitsByOperator(curInput.value).slice(-1).join("").includes(".")
                    ? ''
                    : digitButton.value;
        }
        else {
            let lastVal = InputDisplay.getLastValue();
            if (lastVal == ")" || lastVal == PI)
                curInput.value += `*${digitButton.value}`;
            else
                curInput.value += digitButton.value;
        }
    }
});
operators.addEventListener('click', (e) => {
    const operatorValue = e.target.value;
    if (curInput.value) {
        if ((curInput.value.includes('(') || InputDisplay.getLastValue() == PI) && (InputDisplay.getLastValue() != ')')) {
            curInput.value += operatorValue;
        }
        // equal to button is not pressed
        else if (curInput.value && operatorValue !== "=") {
            console.log('cdzsdcs kc');
            if (display.value.includes("=")) {
                c.actualExpression = display.value = curInput.value + operatorValue;
                curInput.value = "";
            }
            else {
                c.actualExpression +=
                    c.isCalculatorInputAdd === false
                        ? curInput.value + operatorValue
                        : operatorValue;
                display.value +=
                    c.isCalculatorInputAdd === false
                        ? curInput.value + operatorValue
                        : operatorValue;
                curInput.value = "";
            }
            c.isCalculatorInputAdd = false;
        }
    }
});
equalButton.addEventListener('click', () => {
    if (curInput.value && !display.value.includes("=")) {
        if (c.isCalculatorInputAdd == true) {
            console.log(display.value);
        }
        else {
            display.value += curInput.value;
            c.actualExpression += curInput.value;
            console.log(display.value);
        }
        if (isBalanced(c.actualExpression)) {
            curInput.value = c.calculate().toString();
            if (isNaN(Number(curInput.value)) || curInput.value == undefined) {
                c.showError('Expression is not valid. Check it once!');
                display.value = "";
                curInput.value = c.actualExpression;
            }
            c.actualExpression = "";
            c.isCalculatorInputAdd = false;
            console.log(display.value);
        }
        else {
            c.showError('Expression is not valid. Check it once!');
            display.value = "";
            c.actualExpression = "";
            console.log(display.value);
        }
    }
});
memoryButtons.addEventListener('click', (e) => {
    const button = e.target;
    const inputValue = parseFloat(curInput.value);
    switch (button.value) {
        case "MS":
            if (inputValue && !isNaN(inputValue)) {
                Memory.storeNumber(Number(curInput.value));
                button.setAttribute('class', 'button-disable');
                button.parentNode.firstElementChild.removeAttribute('class');
                button.parentNode.firstElementChild.nextElementSibling.removeAttribute('class');
            }
            else
                c.showError('Invalid Input');
            break;
        case "MC":
            Memory.clearNumber();
            button.setAttribute('class', 'button-disable');
            button.parentNode.lastElementChild.removeAttribute('class');
            button.nextElementSibling.setAttribute('class', 'button-disable');
            break;
        case "M+":
            if (inputValue && !isNaN(inputValue)) {
                Memory.addNumber(inputValue);
                c.clearExpression();
            }
            else
                c.showError('Input is Invalid');
            break;
        case "M-":
            if (inputValue && !isNaN(inputValue)) {
                Memory.subtractNumber(inputValue);
                c.clearExpression();
            }
            else
                c.showError('Input is Invalid');
            break;
        case "MR":
            console.log(c.actualExpression);
            curInput.value = Memory.getNumber().toString();
            console.log(Memory.getNumber());
    }
});
calculatorButtons.addEventListener("click", (e) => {
    let calButton = e.target;
    if (calButton.tagName === "BUTTON") {
        let inputValue = parseFloat(curInput.value);
        if (curInput.value !== '') {
            display.value = display.value.includes("=") ? "" : display.value;
            switch (calButton.value) {
                case "x^2":
                    display.value += `(${curInput.value}^2)`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.pow(inputValue, 2).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "sqrt":
                    if (display.value.includes("=")) {
                        display.value = "";
                    }
                    display.value += `sqrt(${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.sqrt(inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "10^":
                    display.value += `(10^${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.pow(10, inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "exp":
                    display.value += `(10^${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.pow(10, inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "log(":
                    display.value += `log(${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.log10(inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "ln(":
                    display.value += `ln(${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.log(inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "x^y":
                    if (display.value.includes("=")) {
                        display.value = "";
                    }
                    display.value += `${curInput.value}^`;
                    c.actualExpression += curInput.value + "^";
                    curInput.value = "";
                    break;
                case "!":
                    display.value += `fact(${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = fact(inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "1/":
                    display.value += `(1/${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = (1 / inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "|":
                    display.value += `|${curInput.value}|`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = curInput.value[0] == "-" ? curInput.value.slice(1) : curInput.value;
                    c.actualExpression += curInput.value;
                    break;
                case "^3":
                    display.value += `(${curInput.value}^3)`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.pow(inputValue, 3).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "cbrt":
                    display.value += `cbrt(${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    inputValue = Math.cbrt(inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "yrootx":
                    curInput.value = `${curInput.value}^(1/`;
                    c.isCalculatorInputAdd = false;
                    break;
                case "e^x":
                    display.value += `(e^${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.pow(Math.E, inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
                case "2^":
                    display.value += `(2^${curInput.value})`;
                    c.isCalculatorInputAdd = true;
                    inputValue = Math.pow(2, inputValue);
                    c.actualExpression += curInput.value;
                    break;
                case "log(x,2)":
                    display.value += `log(${curInput.value},2)`;
                    c.isCalculatorInputAdd = true;
                    curInput.value = Math.log2(inputValue).toString();
                    c.actualExpression += curInput.value;
                    break;
            }
        }
        switch (calButton.value) {
            case "e":
                let expConst = 2.718281828459045.toFixed(3);
                curInput.value && (!isNaN(Number(InputDisplay.getLastValue()))) || InputDisplay.getLastValue() == PI || InputDisplay.getLastValue() == "e"
                    ? curInput.value += `*${expConst}`
                    : curInput.value += expConst;
                break;
            case "pi":
                curInput.value && (!isNaN(Number(InputDisplay.getLastValue())) || InputDisplay.getLastValue() == PI || InputDisplay.getLastValue() == "e")
                    ? curInput.value += `*${PI}`
                    : curInput.value += PI;
                break;
            case "(":
                curInput.value && ((!isNaN(Number(InputDisplay.getLastValue()))) || InputDisplay.getLastValue() == ")")
                    ? curInput.value += `*${calButton.value}`
                    : curInput.value += calButton.value;
                break;
            case ")":
                if (curInput.value.includes('('))
                    curInput.value += calButton.value;
                break;
        }
    }
});
// when "2nd" button is click it flip the column
flipColumn.addEventListener('click', (e) => {
    const button = e.target;
    button.classList.toggle('color-blue');
    const first = document.getElementById("visible-column");
    const second = document.getElementById("hidden-column");
    first.id = "hidden-column";
    second.id = "visible-column";
});
