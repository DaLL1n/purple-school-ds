import express from "express";
import { getWeather } from "./service/api.service.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/weather", async (req, res) => {
  const city = typeof req.query.city === "string" ? req.query.city.trim() : "";

  if (!city) {
    return res.status(400).json({ error: "Необходимо указать город" });
  }

  try {
    const weather = await getWeather(city, "ru");

    return res.json({
      city: weather.name,
      country: weather.sys.country,
      description: weather.weather[0].description,
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
    });
  } catch (error) {
    const status = error?.response?.status;

    if (status === 404) {
      return res.status(404).json({ error: "Город не найден" });
    }

    if (status === 401 || error.message === "Не задан ключ API") {
      return res.status(401).json({ error: "Неверно указан токен API" });
    }

    return res.status(500).json({ error: "Не удалось получить погоду" });
  }
});

app.listen(port, () => {
  console.log(`Weather API запущен на порту ${port}`);
});
