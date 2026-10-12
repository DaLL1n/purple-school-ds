const multiply = require("./multiply");
const add = require("./add");
const divide = require("./multiply");
const subtract = require('./subtract')

const processArgv = process.argv;
const num1 = +processArgv[2];
const num2 = +processArgv[3];
const operation = processArgv[4];

let sum;

const composition = (fn) => fn(num1, num2);

switch (operation) {
  case "add":
    sum = composition(add);
    break;
  case "subtract":
    sum = composition(subtract);
    break;
  case "multiply":
    sum = composition(multiply);
    break;
  case "divide":
    sum = composition(divide);
    break;
}

console.log(sum);
