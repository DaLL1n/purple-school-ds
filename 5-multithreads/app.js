const { Worker } = require("node:worker_threads");
const { PerformanceObserver, performance } = require("perf_hooks");

const perfomanceObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}`);
  });
});

perfomanceObserver.observe({ entryTypes: ["measure"] });
performance.mark("start");
const array1 = Array.from({ length: 75_000 }, (_, i) => i + 1);
const array2 = Array.from({ length: 75_000 }, (_, i) => i + 1);
const array3 = Array.from({ length: 75_000 }, (_, i) => i + 1);
const array4 = Array.from({ length: 75_000 }, (_, i) => i + 1);

async function compute(array) {
  return new Promise((resolse, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: array,
    });
    worker.on("message", (msg) => {
      resolse(msg);
    });
  });
}

async function main() {
  const result = await Promise.all([
    compute(array1),
    compute(array2),
    compute(array3),
    compute(array4),
  ]);

  return result.reduce((acc, num) => acc + num, 0);
}

main();

performance.mark("end");
performance.measure("play", "start", "end");
