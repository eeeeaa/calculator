/****CALCULATOR PROJECT ****/

const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".button-container button");

let currentText = "";

let calculationObject = {
    firstNumber: "",
    secondNumber: "",
    operand: "",
    nonOperand: ""
};

const STATE = {STATE_ONE: 0, STATE_TWO: 1};
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
        }else {
            calculationObject.secondNumber += text;
            currentText = calculationObject.secondNumber; 
        }
        
        updateDisplay(currentText); 
    }
    if(operations.hasOwnProperty(text)){
        if(calculationObject.firstNumber !== ""){
            calculationObject.operand = text;
            currentState = STATE.STATE_TWO;
        }
        nonOperations["="](calculationObject.operand);
    }
    if(nonOperations.hasOwnProperty(text)){
        calculationObject.nonOperand = text;
        if(checkNonOperationValidation()){
            performNonOperation();
        }
    }
}

function decimalNonOperation(){
    if(currentState === STATE.STATE_ONE){
        if(calculationObject.firstNumber !== ""){
            calculationObject.firstNumber += ".";
            currentText = calculationObject.firstNumber;
        }
    }else {
        if(calculationObject.secondNumber !== ""){
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

function performCalculation(chainOperator){
    let result = operations[calculationObject.operand](
        +calculationObject.firstNumber, 
        +calculationObject.secondNumber
        );
    onCalculationFinished(result, chainOperator);
    return result;
}

function onCalculationFinished(result, chainOperator){
    if(chainOperator !== ""){
        currentState = STATE.STATE_TWO;
    } else {
        currentState = STATE.STATE_ONE;
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
    display.textContent = displayText;
}

function clear(){
    calculationObject = {
        firstNumber: "",
        secondNumber: "",
        operand: "",
        nonOperand: ""
    };
    updateDisplay("");
}

