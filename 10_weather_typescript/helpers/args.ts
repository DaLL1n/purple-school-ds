export type ArgumentValue = boolean | string | Array<boolean | string>;
export type Arguments = Record<string, ArgumentValue>;

export function getArgs(args: string[]): Arguments {
  const [, , ...rest] = args;
  const result: Arguments = {};

  rest.forEach((value, index, array) => {
    if (!value.startsWith("-")) {
      return;
    }

    const key = value.substring(1);
    const nextValue = array[index + 1];

    if (nextValue !== undefined && !nextValue.startsWith("-")) {
      const previousValue = result[key];
      result[key] =
        previousValue === undefined
          ? nextValue
          : Array.isArray(previousValue)
            ? [...previousValue, nextValue]
            : [previousValue, nextValue];
      return;
    }

    const previousValue = result[key];
    result[key] =
      previousValue === undefined
        ? true
        : Array.isArray(previousValue)
          ? [...previousValue, true]
          : [previousValue, true];
  });

  return result;
}
