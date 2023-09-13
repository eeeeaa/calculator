/****CALCULATOR PROJECT ****/

let displayArray = [];
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".button-container button");

buttons.forEach((button)=> {
    button.addEventListener('click', (e) => {
       displayArray.push(button.textContent); 
       updateDisplay();
    });
});

const operations = {
    "+":(a,b) => add(a,b),
    "-":(a,b) => subtract(a,b),
    "*":(a,b) => multiply(a,b),
    "/":(a,b) => divide(a,b),
    "%":(a,b) => reminder(a,b)
};

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

function operate(firstNum, operand, secondNum){
    if(operations.hasOwnProperty(operand)){
        return operations[operand](firstNum, secondNum);
    }
}

function updateDisplay(){
    //TODO Update display
}

function clear(){
    displayArray = [];
    updateDisplay();
}

