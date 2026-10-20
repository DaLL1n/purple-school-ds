import axios from "axios";
import {
  getKeyValue,
  TOKEN_DICTIONARY,
} from "./storage.service.js";

export type Language = "en" | "ru";

export interface WeatherCondition {
  description: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
}

export interface WeatherResponse {
  name: string;
  weather: WeatherCondition[];
  main: WeatherMain;
  wind: WeatherWind;
}

export async function getWeather(
  city: string,
  language: Language = "en",
): Promise<WeatherResponse> {
  const token =
    process.env["TOKEN"] ?? (await getKeyValue(TOKEN_DICTIONARY.token));

  if (!token) {
    throw new Error("Не задан ключ API");
  }

  const { data } = await axios.get<WeatherResponse>(
    "https://api.openweathermap.org/data/2.5/weather",
    { params: { q: city, appid: token, lang: language, units: "metric" } },
  );

  return data;
}
