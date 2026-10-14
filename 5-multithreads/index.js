const { PerformanceObserver, performance } = require("perf_hooks");

const perfomanceObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}`);
  });
});

perfomanceObserver.observe({ entryTypes: ["measure"] });

performance.mark("start");

const array = Array.from({ length: 300_000 }, (_, i) => i + 1);

const arrayCount = array.reduce((acc, num) => {
  if (num % 3 === 0) {
    return acc + 1;
  }
  return acc;
}, 0);
performance.mark("end");
performance.measure("play", "start", "end");

