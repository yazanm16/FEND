
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getCityLoc } = require("./getCityLoc");
const { weatherTemp } = require("./weatherTemp");
const { getCityPic } = require("./getCityPic");

const app = express();
const port = 8000;

// Middlewares
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

// Environment variables
const username = process.env.USERNAME;
const WEATHER_KEY = process.env.WEATHER_KEY;
const pixabay_key = process.env.PIXABAY_KEY;

if (!username || !WEATHER_KEY || !pixabay_key) {
  console.error("❌ Missing required environment variables!");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.post("/getCity", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: "City name is required" });

    const location = await getCityLoc(city, username);
    res.json(location);
  } catch (error) {
    console.error("Error fetching city location:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getWeather", async (req, res) => {
  try {
    const { lng, lat, remainingDays } = req.body;
    if (!lng || !lat || remainingDays === undefined) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const weather = await weatherTemp(lng, lat, remainingDays, WEATHER_KEY);
    res.json(weather);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getCityPic", async (req, res) => {
  try {
    const { city_name } = req.body;
    if (!city_name) {
      return res.status(400).json({ error: "City name is required" });
    }

    const cityPic = await getCityPic(city_name, pixabay_key);
    res.json(cityPic);
  } catch (error) {
    console.error("Error fetching city picture:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
