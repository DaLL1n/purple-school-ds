import axios from "axios";
import { getKeyValue, TOKEN_DICTIONARY } from "./storage.service.js";

export async function getWeather(city, language = "en") {
  const token =
    process.env.TOKEN ?? (await getKeyValue(TOKEN_DICTIONARY.token));
  if (!token) {
    throw new Error("Не задан ключ API");
  }
  const { data } = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    { params: { q: city, appid: token, lang: language, units: "metric" } },
  );
  console.log(data);

  return data;
}
