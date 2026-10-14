const { Worker } = require("node:worker_threads");
const { PerformanceObserver, performance } = require("perf_hooks");
const cpu = require("os").cpus().length;

const perfomanceObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}`);
  });
});

perfomanceObserver.observe({ entryTypes: ["measure"] });
performance.mark("start");

const array = Array.from({ length: 300_000 }, (_, i) => i + 1);
const chunkSize = Math.ceil(array.length / cpu);
const chunks = Array.from({ length: cpu }, (_, index) =>
  array.slice(index * chunkSize, (index + 1) * chunkSize),
);

async function compute(array) {
  return new Promise((resolse, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: array,
    });
    worker.on("message", (msg) => {
      resolse(msg);
    });
    worker.on("error", reject);
  });
}

async function main() {
  const result = await Promise.all(chunks.map(compute));

  return result.reduce((acc, num) => acc + num, 0);
}

main().then((count) => {
  performance.mark("end");
  performance.measure("play", "start", "end");
  console.log(count);
});
