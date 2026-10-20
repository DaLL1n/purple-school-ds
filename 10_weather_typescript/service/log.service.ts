import chalk from "chalk";
import dedent from "dedent-js";
import type { Language, WeatherResponse } from "./api.service.js";

export function printError(error: string): void {
  console.log(chalk.bgRed(" ERROR ") + "" + error);
}

export function printSuccess(message: string): void {
  console.log(chalk.bgGreen(" SUCCESS ") + "" + message);
}

export function printHelp(): void {
  console.log(
    dedent(`${chalk.bgCyan(" HELP ")}
    Без параметров - вывод погоды
    -s CITY для установки города (можно указать несколько раз)
    -l LANGUAGE для установки языка (en или ru)
    -h для вывода помощи
    -t [API_KEY] для сохранения токена
    `),
  );
}

export function printWeather(
  response: WeatherResponse,
  icon: string,
  language: Language = "en",
): void {
  const labels =
    language === "ru"
      ? {
          weather: "Погода в городе",
          temperature: "Температура",
          feelsLike: "ощущается как",
          humidity: "Влажность",
          windSpeed: "Скорость ветра",
        }
      : {
          weather: "Weather in",
          temperature: "Temperature",
          feelsLike: "feels like",
          humidity: "Humidity",
          windSpeed: "Wind speed",
        };

  console.log(
    dedent(`${chalk.bgYellow(" WEATHER ")} ${labels.weather} ${response.name}
    ${icon} ${response.weather[0]?.description ?? "Неизвестно"}
    ${labels.temperature}: ${response.main.temp} (${labels.feelsLike} ${response.main.feels_like})
    ${labels.humidity}: ${response.main.humidity}%
    ${labels.windSpeed}: ${response.wind.speed}
    `),
  );
}
