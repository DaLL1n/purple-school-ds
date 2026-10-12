const multiply = require("./multiply");
const add = require("./add");
const divide = require("./multiply");
const subtract = require("./subtract");

const processArgv = process.argv;
const num1 = +processArgv[2];
const num2 = +processArgv[3];
const operation = processArgv[4];

const operations = {
  add,
  multiply,
  divide,
  subtract,
};

const Events = require("events");
const emitter = new Events();

const composition = (eventName, fn) => {
  return emitter.on(eventName, () => emitter.emit("result", fn(num1, num2)));
};

emitter.on("operation", (eventName) => {
  composition(eventName, operations[eventName]);
  emitter.emit(operation);
});

emitter.on("result", (value) => {
  console.log(value);
});

emitter.emit('operation', operation)
