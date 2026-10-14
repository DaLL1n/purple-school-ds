const { parentPort, workerData } = require("node:worker_threads");

function countNums(array) {
  return array.reduce((acc, num) => {
    if (num % 3 === 0) {
      return acc + 1;
    }
    return acc;
  }, 0);
}

parentPort.postMessage(countNums(workerData));
