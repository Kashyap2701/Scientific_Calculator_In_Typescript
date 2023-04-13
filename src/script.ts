const curInput: HTMLInputElement = document.getElementById("cal-input") as HTMLInputElement;
const display: HTMLInputElement = document.getElementById("display-expression") as HTMLInputElement;
const digits: HTMLDivElement = document.getElementsByClassName("digits")[0] as HTMLDivElement;
const operators: HTMLDivElement = document.getElementsByClassName("operators")[0] as HTMLDivElement;
const calculatorButtons: HTMLDivElement = document.getElementById("calculator-btns") as HTMLDivElement;
const mathFunctions: HTMLDivElement = document.getElementById("maths-functions") as HTMLDivElement;
const degToRed: HTMLDivElement = document.getElementById('toggle-angle') as HTMLDivElement;
const memoryButtons: HTMLDivElement = document.getElementById('memory-buttons') as HTMLDivElement;
const equalButton: HTMLButtonElement = document.getElementById("equal-to") as HTMLButtonElement;
const errorContainer: HTMLDivElement = document.getElementById('error-container') as HTMLDivElement;
const flipColumn: HTMLDivElement = document.getElementById('flipColumn') as HTMLDivElement;
const FEButton:HTMLButtonElement = document.getElementById('F-E') as HTMLButtonElement;
const dropDown = document.getElementsByClassName('dropdown');
const dropDownItems = document.getElementsByClassName('dropdown-items');

const PI = "\u03C0";

// ----------------------------- Utility Classes ------------------------

class Calculator {

    actualExpression:string;
    angleInDegree:boolean = true;
    isCalculatorInputAdd = false;
    isEvaluated = false;

    constructor(){
        this.actualExpression='';
        display.value='';
        curInput.value='';
    }

    public static clearLastInput():void{
        curInput.value = curInput.value.slice(0,-1);
    }

    public static resetCalculator():void{
        curInput.value = '';
        display.value = '';
    }

    public showError(errorMessage:string){
        errorContainer.style.display = 'flex';
        (errorContainer.firstElementChild! as HTMLElement).innerText = errorMessage;
        setTimeout(() => {
          errorContainer.style.display = 'none';
        }, 3000);
      }

    public static splitsByOperator(expression:string):string[]{
        // list of operators to split by
        const operators = ["+", "*", "-", "/", "(", ")", "%", "^",PI];

        // store current multi-digit number
        let currentNumber = ""; 

        // array to store the parts of the expression
        const parts:string[] = [];

        for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (operators.includes(char!)) {

            // if the character is an operator
            if (currentNumber !== "") {
            
            // add it to the parts array
            parts.push(currentNumber); 
            // reset the current number variable
            currentNumber = ""; 
            }

            parts.push(char!); // add the operator to the parts array
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
        for(let item=0;item<parts.length;item++){

        // if part is "-" symbol
        if (parts[item] == "-") {
            
            if (
            (Number(item) == 0 && parts[Number(item) + 1] != "(") ||
            parts[Number(item) - 1] == "(" ||
            (isNaN(Number(parts[Number(item) - 1])) && parts[Number(item) - 1] != ")")
            ) {
            let x = parts[item]!;
            let y = parts[Number(item) + 1]!;
            let temp = x + y;
            parts.splice(Number(item), 2, temp);
            
            }
            if(parts[item]=="-(")
            {
            parts.splice(Number(item),1,"-","(");
            }
        }
        }
        return parts!;
    }
    
    private infixToPrefix(str:string):string {

      let expression = Calculator.splitsByOperator(str).reverse();
    
      // Create an empty stack and an empty result string
      let stack:string[] = [];
      let result:string = "";
    
      for (let i = 0; i < expression.length; i++) {
        let c = expression[i];
        let n = expression[i];
        if (c.match(/[a-z0-9]/i)) {
          result += c + " ";
        } else if (c === ")") {
          stack.push(c);
        }
        else if (c === PI){
          result += Math.PI + " ";
        }
         else if (
          c === "+" ||
          c === "-" ||
          c === "*" ||
          c === "/" ||
          c === "(" ||
          c === "%" ||
          c === "^" 
        ) {
            while (
              stack.length > 0 &&
              stack[stack.length - 1] !== ")" &&
              this.precedence(c) < this.precedence(stack[stack.length - 1])
            ) {
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

    private precedence(operator:string):number {
        if (operator === "+" || operator === "-") {
          return 1;
        } else if (operator === "*" || operator === "/" || operator === "%") {
          return 2;
        } else if (operator === "^") {
          return 3;
        } else {
          return 0;
        }
    }

    private evaluate(expression:string):number {

        let tokens = expression.split(" ");
        
        let stack:number[] = [];

        for (let i = tokens.length - 1; i >= 0; i--) {

          let token:string = tokens[i]!;
      
          if (token.match(/[0-9]/i)) {
            stack.push(parseFloat(token));
          } 
          else if(token.match(PI)){
            stack.push(Math.PI);
          }  
          else if (
            token === "+" ||
            token === "-" ||
            token === "*" ||
            token === "/" ||
            token === "%" ||
            token === "^"
          ) {
            let operand1 = stack.pop()!;            ;
            let operand2 = stack.pop()!;
            let result:number=0;
            
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
            console.log('result' + result  );
            stack.push(result);
          }
          console.log('stack' + stack  );
                
        }
        return stack.pop()!;
    }

    public calculate(exp?:string):number{
      if(exp){
        return this.evaluate(this.infixToPrefix(exp));
      }
      return this.evaluate(this.infixToPrefix(this.actualExpression));
    }

    public clearExpression():void{
      this.actualExpression = '';
    }

}

class InputDisplay extends Calculator{

  public static setInput(input:string|number):void{
      curInput.value += input as string;
      curInput.focus();
  };

  public static getInput():string{
      return curInput.value;
  }

  public static getLastValue():string{
      return this.splitsByOperator(curInput.value).slice(-1)[0];
  }

  public static isExpression():boolean{
    if(curInput.value.includes('(') || curInput.value.includes(')'))
      return true;
    return false;
  }
  
  public static checklastValueOperator():boolean{
    const op = InputDisplay.getLastValue();
    if(op=='+' || op=='-' || op=='%' || op=='*' || op=='/' || op=='^')
      return true;
    return false;
  }

  public static clear():void{
    curInput.value = '';
  }
}

class Memory {

  private static accumlator:number = 0;

  public static storeNumber(num:number):void{
      this.accumlator = num;
  }

  public static addNumber(num:number):void{
    this.accumlator += num
  }

  public static subtractNumber(num:number):void{
    this.accumlator -= num;
  }

  public static clearNumber():void{
    this.accumlator = 0;
  }

  public static getNumber():number{
    return this.accumlator;
  }
}

const c = new Calculator();

// ----------------------------- Utility Functions ------------------------

// Trigonometry Functions and Maths Functions
for(let i=0;i<dropDownItems.length;i++){ 
dropDownItems[i]!.addEventListener('click',utilityDropdownFunctions);
}
function utilityDropdownFunctions(e:any){

let target = ['sin','cos','tan','cot','sec','cosec','ceil','floor','abs'];
let operator = ['+','-','=','%','^',"*","/"];
let angleValue = c.angleInDegree ? parseFloat(curInput.value) : c.calculate(curInput!.value);
let curDigit:number = parseFloat(curInput.value);

if (curInput.value) {

    // if event target include the valid target
    if(target.includes(e.target.value))
    {
    // if display value doesn't contain equal
    if (display.value && !operator.some((op)=>display.value.includes(op)))
        // eg. sin(cos(9)) is possible
        display.value = `${e.target.value}(${display.value})`;
    else if(display.value.includes("=")){
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
for(let i=0;i<dropDown.length;i++){
dropDown[i].addEventListener('click',toggleDropDown);
}
function toggleDropDown(e:any) {
if(e.target.tagName=='BUTTON')
e.target.nextElementSibling.style.display == "none"
    ? (e.target.nextElementSibling.style.display = "flex") 
    : (e.target.nextElementSibling.style.display = "none");
}

// function check parenthenses
function isBalanced(str:string):boolean {
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
        } else {
        stack.pop();
        }
    }
    // Ignore all other characters
    }

    // If the stack is empty, all parentheses are balanced
    return stack.length === 0;
}

// Find the Fectorial Number
function fact(number:number):number {
let fact = 1;
for (let i = number; i >= 1; i--) {
    fact = fact * i;
}
return fact;
}