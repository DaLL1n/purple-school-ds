import { promises } from "fs";
import { homedir } from "node:os";
import { join } from "path";

const filePath = join(homedir(), "weather-data.json");

export const TOKEN_DICTIONARY = {
  token: "token",
  city: "city",
  language: "language",
};

export async function saveKeyValue(key, value) {
  let data = {};
  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    data = JSON.parse(file);
  }
  data[key] = value;
  await promises.writeFile(filePath, JSON.stringify(data));
}

export async function getKeyValue(key) {
  if (await isExist(filePath)) {
    const file = await promises.readFile(filePath);
    const data = JSON.parse(file);
    return data[key];
  }

  return undefined;
}

async function isExist(path) {
  try {
    await promises.stat(path);
    return true;
  } catch (error) {
    return false;
  }
}
