import { promises } from "fs";
import { homedir } from "node:os";
import { join } from "path";

const filePath = join(homedir(), "weather-data.json");

export const TOKEN_DICTIONARY = {
  token: "token",
  city: "city",
  language: "language",
} as const;

export type StorageKey =
  (typeof TOKEN_DICTIONARY)[keyof typeof TOKEN_DICTIONARY];
export type StorageValue = string | string[];
type StorageData = Partial<Record<StorageKey, StorageValue>>;

export async function saveKeyValue(
  key: StorageKey,
  value: StorageValue,
): Promise<void> {
  let data: StorageData = {};

  if (await isExist(filePath)) {
    data = await readStorage();
  }

  data[key] = value;
  await promises.writeFile(filePath, JSON.stringify(data));
}

export async function getKeyValue(
  key: StorageKey,
): Promise<StorageValue | undefined> {
  if (await isExist(filePath)) {
    const data = await readStorage();
    return data[key];
  }

  return undefined;
}

async function readStorage(): Promise<StorageData> {
  const file = await promises.readFile(filePath, "utf8");
  const data: unknown = JSON.parse(file);

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Файл хранилища имеет неверный формат");
  }

  return data as StorageData;
}

async function isExist(path: string): Promise<boolean> {
  try {
    await promises.stat(path);
    return true;
  } catch {
    return false;
  }
}
