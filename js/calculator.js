/****CALCULATOR PROJECT ****/
//State Zero: temporary state after calculation
//State One: state for first number input
//State Two: state for second number input

const display = document.querySelector(".display div");
const subDisplay = document.querySelector(".sub-display div");
const buttons = document.querySelectorAll(".button-container button");

let currentText = "";

let calculationObject = {
    firstNumber: "",
    secondNumber: "",
    operand: "",
    nonOperand: ""
};

const MAX_LENGTH = 8;
const STATE = {STATE_ONE: 1, STATE_TWO: 2, STATE_ZERO: 0};
let currentState = STATE.STATE_ONE;

const operations = {
    "+":(a,b) => add(a,b),
    "-":(a,b) => subtract(a,b),
    "*":(a,b) => multiply(a,b),
    "/":(a,b) => divide(a,b),
    "%":(a,b) => reminder(a,b)
};

const nonOperations = {
    "AC":() => clear(),
    "=": (chainOperator = "") => {
        (checkCalculationValidation()) ? updateDisplay(performCalculation(chainOperator)): null;
    },
    ".":() => {
        decimalNonOperation();
    },
    "+/-":() => {
        positiveNegativeNumber();
    },
    "BACK": () => {
        backPress();
    }
};

const specialCases = {
    divideByZero: () => {return "The universe explodes!";},
    
}

buttons.forEach((button)=> {
    button.addEventListener('click', (e) => {
        InputMapping(button.textContent);
    });
});

window.addEventListener('keydown', function(e){
    e.preventDefault();
    console.log(e.code);
    let re = new RegExp("^Numpad[0-9]+$");
    let re2 = new RegExp("^Digit[0-9]+$");
    if(re.test(e.code) || re2.test(e.code)){
        InputMapping(e.code.charAt(e.code.length - 1));
    } else {
        switch(e.code){
            case "Space": {
                InputMapping("AC");
                break;
            }
            case "Enter":
            case "Equal": {
                InputMapping("=");
                break;
            }
            case "NumpadAdd": {
                InputMapping("+");
                break;
            }

            case "Minus":
            case "NumpadSubtract": {
                InputMapping("-");
                break;
            }

            case "NumpadMultiply": {
                InputMapping("*");
                break;
            }

            case "NumpadDivide": {
                InputMapping("/");
                break;
            }
            
            case "NumpadDecimal": {
                InputMapping(".");
                break;
            }
        }  
    }
});

function InputMapping(text){
    if(!isNaN(text)){
        console.log("numbers");
        if(currentState === STATE.STATE_ONE){
            calculationObject.firstNumber += text;
            currentText = calculationObject.firstNumber;
        }else if (currentState === STATE.STATE_TWO) {
            calculationObject.secondNumber += text;
            currentText = calculationObject.secondNumber; 
        } else if(currentState === STATE.STATE_ZERO) {
            calculationObject.firstNumber = text;
            currentText = calculationObject.firstNumber;
            currentState = STATE.STATE_ONE;
        }
        
        updateDisplay(currentText); 
    }
    if(operations.hasOwnProperty(text)){
        nonOperations["="](calculationObject.operand);
        if(calculationObject.firstNumber !== ""){
            calculationObject.operand = text;
            currentState = STATE.STATE_TWO;
        }
    }
    if(nonOperations.hasOwnProperty(text)){
        if(calculationObject.firstNumber !== ""){
           calculationObject.nonOperand = text;
            if(checkNonOperationValidation()){
                performNonOperation();
            } 
        } 
    }
}

function decimalNonOperation(){
    if(currentState === STATE.STATE_ONE){
        if(calculationObject.firstNumber !== "" && 
        !calculationObject.firstNumber.includes(".")){
            calculationObject.firstNumber += ".";
            currentText = calculationObject.firstNumber;
        }
        updateDisplay(currentText);
    }else if(currentState === STATE.STATE_TWO) {
        if(calculationObject.secondNumber !== "" && 
        !calculationObject.secondNumber.includes(".")){
            calculationObject.secondNumber += ".";
            currentText = calculationObject.secondNumber;
        }
        updateDisplay(currentText);
    }
    
}

function positiveNegativeNumber(){
    if(currentState === STATE.STATE_ONE){
        if(calculationObject.firstNumber !== ""){
            if(calculationObject.firstNumber.includes("-")){
                calculationObject.firstNumber = 
                calculationObject.firstNumber.replace("-","");

                currentText = calculationObject.firstNumber;
                
            }else{
                calculationObject.firstNumber = 
                "-" + calculationObject.firstNumber;
                currentText = calculationObject.firstNumber;
            }
            updateDisplay(currentText);
        }
    }else if(currentState === STATE.STATE_TWO) {
        if(calculationObject.secondNumber !== ""){
            if(calculationObject.secondNumber.includes("-")){
                calculationObject.secondNumber = 
                calculationObject.secondNumber.replace("-","");
                currentText =calculationObject.secondNumber;
                
            }else{
                calculationObject.secondNumber = 
                "-" + calculationObject.secondNumber;
                currentText = calculationObject.secondNumber;
            }
            updateDisplay(currentText);
        }
    } else if(currentState === STATE.STATE_ZERO){
        currentState = STATE.STATE_ONE;
        positiveNegativeNumber();
        return;
    }
}

function backPress(){
    if(currentState === STATE.STATE_ONE || currentState === STATE.STATE_ZERO){
        if(calculationObject.firstNumber !== ""){
            calculationObject.firstNumber = calculationObject.firstNumber
            .slice(0, calculationObject.firstNumber.length - 1);
            
            currentText = calculationObject.firstNumber;
            updateDisplay(currentText);
        }
    }else if(currentState === STATE.STATE_TWO) {
        if(calculationObject.secondNumber !== ""){
            calculationObject.secondNumber = calculationObject.secondNumber
            .slice(0, calculationObject.secondNumber.length - 1);
            
            currentText = calculationObject.secondNumber;
            updateDisplay(currentText);
        }
    }
}

function add(a,b){
    return a + b;
}

function subtract(a,b){
    return a - b;
}

function multiply(a,b){
    return a * b;
}

function divide(a,b){
    return a / b;
}

function reminder(a,b){
    return a % b;
}

function round(n){
    return Math.round((n + Number.EPSILON) * 10000) / 10000;
}


function performCalculation(chainOperator){
    let result = round(operations[calculationObject.operand](
        +calculationObject.firstNumber, 
        +calculationObject.secondNumber
        ));
    if(`${result}`.length > MAX_LENGTH){
        result = result.toExponential();
    }
    let specialCase = null;
    if(calculationObject.operand === "/" && +calculationObject.secondNumber === 0){
        specialCase = specialCases.divideByZero();
    }
    onCalculationFinished(result, chainOperator);
    if(specialCase != null){
        return specialCase;
    }else {
       return result; 
    }
}

function onCalculationFinished(result, chainOperator){
    if(chainOperator !== ""){
        currentState = STATE.STATE_TWO;
    } else {
        currentState = STATE.STATE_ZERO;
    }
    calculationObject = {
        firstNumber: `${result}`,
        secondNumber: "",
        operand: `${chainOperator}`,
        nonOperand: ""
    };
}

function performNonOperation(){
    nonOperations[calculationObject.nonOperand]();
}

function checkCalculationValidation(){
    let valid = true;
    for(key in calculationObject){
        if(calculationObject[key] === "" && key !== "nonOperand"){
            valid = false;
            break;
        }
    }
    return valid;
}

function checkNonOperationValidation(){
    return nonOperations.hasOwnProperty(calculationObject.nonOperand);
}

function updateDisplay(displayText){
    let subText = `${calculationObject.firstNumber} 
    ${calculationObject.operand} ${calculationObject.secondNumber}`;
    subDisplay.textContent = subText;
    display.textContent = displayText;
}

function clear(){
    currentState = STATE.STATE_ONE;
    calculationObject = {
        firstNumber: "",
        secondNumber: "",
        operand: "",
        nonOperand: ""
    };
    updateDisplay("");
}

