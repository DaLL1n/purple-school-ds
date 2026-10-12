const processArgv = process.argv;
const num1 = +processArgv[2];
const num2 = +processArgv[3];
const operation = processArgv[4];

let sum;

switch (operation) {
  case "add":
    sum = num1 + num2;
    break;
  case "divide":
    sum = num1 - num2;
    break;
  case "multiply":
    sum = num1 * num2;
    break;
  case "subtract":
    sum = num1 / num2;
    break;
}

console.log(sum);