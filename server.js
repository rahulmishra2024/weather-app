const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(express.static(path.join(__dirname, "public")));

// Endpoint to fetch weather by city name
app.get("/api/weather", async (req, res) => {
  let url = "";
const { city, lat, lon } = req.query;

if (city) {
  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
} else if (lat && lon) {
  url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
} else {
  return res.status(400).json({ error: "City or coordinates are required" });
}


  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(404).json({ error: data.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});


// Endpoint for 5-day forecast
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
      return res.status(404).json({ error: data.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
