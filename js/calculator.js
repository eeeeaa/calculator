/****CALCULATOR PROJECT ****/

const display = document.querySelector(".display");
const subDisplay = document.querySelector(".sub-display");
const buttons = document.querySelectorAll(".button-container button");

let currentText = "";

let calculationObject = {
    firstNumber: "",
    secondNumber: "",
    operand: "",
    nonOperand: ""
};

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
    }
};

buttons.forEach((button)=> {
    button.addEventListener('click', (e) => {
        InputMapping(button);
    });
});

function InputMapping(button){
    let text = button.textContent;
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
    }else if(currentState === STATE.STATE_TWO) {
        if(calculationObject.secondNumber !== "" && 
        !calculationObject.secondNumber.includes(".")){
            calculationObject.secondNumber += ".";
            currentText = calculationObject.secondNumber;
        }
    }
    
    updateDisplay(currentText);
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
    onCalculationFinished(result, chainOperator);
    return result;
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
    ${calculationObject.operand} ${calculationObject.secondNumber} 
    ${calculationObject.nonOperand}`;

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

