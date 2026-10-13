const multiply = require("./multiply");
const add = require("./add");
const divide = require("./divide");
const subtract = require("./subtract");

const processArgv = process.argv;
const num1 = +processArgv[2];
const num2 = +processArgv[3];
const operation = processArgv[4];

const Events = require("events");
const emitter = new Events();

const composition = (fn) => {
  return emitter.emit("result", fn(num1, num2));
};

emitter.on("add", () => composition(add));
emitter.on("multiply", () => composition(multiply));
emitter.on("divide", () => composition(divide));
emitter.on("subtract", () => composition(subtract));

emitter.on("result", (value) => {
  console.log(value);
});

emitter.emit(operation);
