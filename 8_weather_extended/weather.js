#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { getWeather } from "./service/api.service.js";
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

async function saveToken(token) {
  if (!token.length) {
    printError("Не передан token");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);

    printSuccess("Токен сохранён");
  } catch (error) {
    printError(error.message);
  }
}

async function saveCity(city) {
  const cities = Array.isArray(city) ? city : [city];
  if (!cities.length || cities.some((value) => !value.length)) {
    printError("Не передан city");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, cities);

    printSuccess("Города сохранены");
  } catch (error) {
    printError(error.message);
  }
}

async function saveLanguage(language) {
  if (!language.length || !["en", "ru"].includes(language)) {
    printError("Язык должен быть en или ru");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.language, language);

    printSuccess("Язык сохранён");
  } catch (error) {
    printError(error.message);
  }
}

async function getForcast() {
  try {
    const configuredCities =
      process.env.CITY ?? (await getKeyValue(TOKEN_DICTIONARY.city));
    const cities = Array.isArray(configuredCities)
      ? configuredCities
      : [configuredCities];
    const language = (await getKeyValue(TOKEN_DICTIONARY.language)) ?? "en";
    const weather = await Promise.all(
      cities.map((city) => getWeather(city, language)),
    );
    weather.forEach((cityWeather) => printWeather(cityWeather, "", language));
  } catch (error) {
    if (error?.response?.status === 404) {
      printError("Неверно указан город");
    } else if (error?.response?.status === 401) {
      printError("Неверно указан токен");
    } else {
      printError(error.message);
    }
  }
}

async function initCLI() {
  const args = getArgs(process.argv);

  if (args.h) {
    printHelp();
  } else if (args.s) {
    return saveCity(args.s);
  } else if (args.l) {
    return saveLanguage(args.l);
  } else if (args.t) {
    return saveToken(args.t);
  } else {
    return getForcast();
  }
}

initCLI();
