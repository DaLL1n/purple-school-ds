export function getArgs(args) {
  const res = {};

  const [executer, file, ...rest] = args;
  rest.forEach((value, index, array) => {
    if (value.charAt(0) === "-") {
      if (index === array.length - 1) {
        const key = value.substring(1);
        res[key] = res[key] === undefined ? true : [].concat(res[key], true);
      } else if (array[index + 1].charAt(0) !== "-") {
        const key = value.substring(1);
        const nextValue = array[index + 1];
        res[key] =
          res[key] === undefined ? nextValue : [].concat(res[key], nextValue);
      } else {
        const key = value.substring(1);
        res[key] = res[key] === undefined ? true : [].concat(res[key], true);
      }
    }
  });

  return res;
}
