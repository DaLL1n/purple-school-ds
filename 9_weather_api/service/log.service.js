import chalk from "chalk";
import dedent from "dedent-js";

export function printError(error) {
  console.log(chalk.bgRed(" ERROR ") + "" + error);
}

export function printSuccess(message) {
  console.log(chalk.bgGreen(" SUCCESS ") + "" + message);
}

export function printHelp() {
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

export function printWeather(res, icon, language = "en") {
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
    dedent(`${chalk.bgYellow(" WEATHER ")} ${labels.weather} ${res.name}
    ${icon} ${res.weather[0].description}
    ${labels.temperature}: ${res.main.temp} (${labels.feelsLike} ${res.main.feels_like})
    ${labels.humidity}: ${res.main.humidity}%
    ${labels.windSpeed}: ${res.wind.speed}
    `),
  );
}
