const processArgv = process.argv;

function replaceToNumber(str) {
  const times = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  for (let i = 2; i < str.length; i += 2) {
    const time = str[i];
    const nameTime = str[i + 1];
    
    if (!nameTime) continue;

    if (nameTime.includes("час")) {
      times.hours = +time;
    }

    if (nameTime.includes("мин")) {
      times.minutes = +time;
    }

    if (nameTime.includes("сек")) {
      times.seconds = +time;
    }
  }

  const { hours, minutes, seconds } = times;
  console.log(hours, minutes, seconds);

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

const timerStart = replaceToNumber(processArgv);

setTimeout(() => console.log("Таймер прозвонил"), timerStart);
