// Fetch weather by city name
async function getWeatherByCity(city) {
//   const url = `/api/weather?city=${city}`;
const url = `https://weather-app-raei.onrender.com/api/weather?city=${city}`;
  fetchAndDisplayWeather(url);
  fetchForecast(city);
  flipCard();
}

// Fetch weather by coordinates
async function getWeatherByLocation(lat, lon) {
//   const url = `/api/weather?lat=${lat}&lon=${lon}`;
const url = `https://weather-app-raei.onrender.com/api/weather?lat=${lat}&lon=${lon}`;
  fetchAndDisplayWeather(url);
}

// Fetch and display current weather
async function fetchAndDisplayWeather(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      document.getElementById("weatherResult").innerHTML = `
        <button onclick="resetFlip()" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 20px; cursor: pointer;">🔙</button>
        <h3>📍 ${data.name}, ${data.sys.country}</h3>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>🌡 Temperature: ${data.main.temp}°C</p>
        <p>🤔 Feels Like: ${data.main.feels_like}°C</p>
        <p>🌥 Condition: ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬 Wind: ${data.wind.speed} m/s</p>
        <div id="forecast" style="margin-top: 20px;"></div>
      `;
    } else {
      document.getElementById("weatherResult").innerHTML = `
        <button onclick="resetFlip()" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 20px; cursor: pointer;">🔙</button>
        <p style="margin-top: 100px; text-align: center;">❌ City not found!</p>
      `;
    }
  } catch (error) {
    document.getElementById("weatherResult").innerText = "Error fetching weather data.";
    console.error(error);
  }
}

// Fetch and show forecast
async function fetchForecast(city) {
  try {
    // const response = await fetch(`/api/forecast?city=${city}`);
    const url = `https://weather-app-raei.onrender.com/api/forecast?city=${city}`;
    const data = await response.json();

    if (data.cod !== "200") return;

    const daily = {};
    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date] && item.dt_txt.includes("12:00:00")) {
        daily[date] = item;
      }
    });

    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "<h4 style='text-align:center;'>📅 5-Day Forecast</h4><div class='forecast-container'></div>";
    const container = forecastDiv.querySelector(".forecast-container");

    Object.values(daily).slice(0, 5).forEach(item => {
      const icon = item.weather[0].icon;
      const day = new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short" });

      container.innerHTML += `
        <div class="forecast-card">
          <p>${day}</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
          <p>${item.main.temp}°C</p>
          <p>${item.weather[0].main}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error("Forecast error:", err);
  }
}

// Called when user clicks Get Weather
function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (city.trim() !== "") {
    getWeatherByCity(city);
  }
}

// Called on page load: get current location
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
        flipCard();
      },
      () => console.warn("Geolocation not available")
    );
  }
};

// Dark Mode Toggle
document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
  document.getElementById("toggleMode").innerText = mode;
});

// Flip card front/back
function flipCard() {
  document.querySelector(".flip-box").classList.add("flipped");
}
function resetFlip() {
  document.querySelector(".flip-box").classList.remove("flipped");
  setTimeout(() => {
    document.getElementById("cityInput").focus();
  }, 300);
}
