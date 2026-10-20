#!/usr/bin/env node
import { getArgs, type ArgumentValue } from "./helpers/args.js";
import { getWeather, type Language } from "./service/api.service.js";
import {
  printError,
  printHelp,
  printSuccess,
  printWeather,
} from "./service/log.service.js";
import {
  getKeyValue,
  saveKeyValue,
  TOKEN_DICTIONARY,
} from "./service/storage.service.js";

function getFirstString(value: ArgumentValue | undefined): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  return Array.isArray(value)
    ? value.find((item): item is string => typeof item === "string")
    : undefined;
}

function getStringValues(value: ArgumentValue | undefined): string[] {
  if (typeof value === "string") {
    return [value];
  }

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isLanguage(value: string): value is Language {
  return value === "en" || value === "ru";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function saveToken(token: string | undefined): Promise<void> {
  if (!token?.length) {
    printError("Не передан token");
    return;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess("Токен сохранён");
  } catch (error: unknown) {
    printError(getErrorMessage(error));
  }
}

async function saveCity(city: ArgumentValue | undefined): Promise<void> {
  const cities = getStringValues(city);

  if (!cities.length || cities.some((value) => !value.length)) {
    printError("Не передан city");
    return;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, cities);
    printSuccess("Города сохранены");
  } catch (error: unknown) {
    printError(getErrorMessage(error));
  }
}

async function saveLanguage(language: string | undefined): Promise<void> {
  if (!language || !isLanguage(language)) {
    printError("Язык должен быть en или ru");
    return;
  }

  try {
    await saveKeyValue(TOKEN_DICTIONARY.language, language);
    printSuccess("Язык сохранён");
  } catch (error: unknown) {
    printError(getErrorMessage(error));
  }
}

async function getForecast(): Promise<void> {
  try {
    const configuredCities =
      process.env["CITY"] ?? (await getKeyValue(TOKEN_DICTIONARY.city));
    const cities = getStringValues(configuredCities);

    if (!cities.length) {
      printError("Не передан city");
      return;
    }

    const configuredLanguage = await getKeyValue(TOKEN_DICTIONARY.language);
    const language: Language =
      typeof configuredLanguage === "string" && isLanguage(configuredLanguage)
        ? configuredLanguage
        : "en";
    const weather = await Promise.all(
      cities.map((city) => getWeather(city, language)),
    );

    weather.forEach((cityWeather) => printWeather(cityWeather, "", language));
  } catch (error: unknown) {
    const responseStatus =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "status" in error.response
        ? error.response.status
        : undefined;

    if (responseStatus === 404) {
      printError("Неверно указан город");
    } else if (responseStatus === 401) {
      printError("Неверно указан токен");
    } else {
      printError(getErrorMessage(error));
    }
  }
}

async function initCLI(): Promise<void> {
  const args = getArgs(process.argv);

  if (args["h"]) {
    printHelp();
  } else if (args["s"] !== undefined) {
    await saveCity(args["s"]);
  } else if (args["l"] !== undefined) {
    await saveLanguage(getFirstString(args["l"]));
  } else if (args["t"] !== undefined) {
    await saveToken(getFirstString(args["t"]));
  } else {
    await getForecast();
  }
}

void initCLI();
