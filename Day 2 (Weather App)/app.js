const apiKey = "EFsZgPMJ0wUmv0EQp7uZ4AW0A9d0Nu9X"; 
const input = document.getElementById("cityInput");

// DOM Elements
const temp = document.getElementById("temp");
const aqi = document.getElementById("aqi");
const weatherCondition = document.getElementById("weatherCondition");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const pressure = document.getElementById("pressure");
const rainChance = document.getElementById("rainChance");
const uv = document.getElementById("uv");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const visibility = document.getElementById("visibility");
const summary = document.getElementById("summary");

document.querySelector("search").addEventListener("click", () => {
    const city = input.value.trim();
    if (city) getWeather(city);
});

async function getCoordinates(city) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const res = await fetch(geoUrl);
    const data = await res.json();
    if (!data.results) throw new Error("City not found!");
    const { latitude, longitude } = data.results[0];
    return { lat: latitude, lon: longitude };
}

async function getWeather(city) {
    try {
        const { lat, lon } = await getCoordinates(city);

        // --- Get data from Tomorrow.io ---
        const urlTomorrow = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKey}`;
        const res1 = await fetch(urlTomorrow);
        const data1 = await res1.json();
        const weather = data1.data.values;

        // --- Get data from Open-Meteo ---
        const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,uv_index_max&timezone=auto`;
        const res2 = await fetch(openMeteoUrl);
        const data2 = await res2.json();

        const sunriseTime = data2.daily.sunrise[0];
        const sunsetTime = data2.daily.sunset[0];
        const uvIndex = data2.daily.uv_index_max[0];

        // Show Data
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById("dateText").textContent = today.toLocaleDateString('en-IN', options);
        document.getElementById("locationText").textContent = `${city}, India`;
        document.getElementById("cityName").innerHTML = `${city} <span>- Weather Forecast</span>`;
        temp.innerHTML = `${Math.round(weather.temperature)}°C`;
        weatherCondition.innerHTML = formatCondition(weather.weatherCode);
        wind.innerHTML = `${weather.windSpeed} <span>km/hr</span>`;
        humidity.innerHTML = `${weather.humidity}%`;
        pressure.innerHTML = `${weather.pressureSeaLevel}<span> mbar</span>`;
        rainChance.innerHTML = `${weather.precipitationProbability}%`;
        uv.innerHTML = uvIndex || "N/A";
        visibility.innerHTML = formatVisibility(weather.visibility);
        aqi.innerHTML = weather.epaIndex || "N/A";
        sunrise.innerHTML = formatTime(sunriseTime);
        sunset.innerHTML = formatTime(sunsetTime);
        summary.innerHTML = generateAISummary(weather, uvIndex);
        document.getElementById("weatherData").style.display = "block";
        document.getElementById("aiReport").style.display = "block";
    } catch (err) {
        alert("Error: " + err.message);
    }
}

// Helpers
function formatCondition(code) {
    const map = {
        1000: "Clear",
        1001: "Cloudy",
        1100: "Mostly Clear",
        1101: "Partly Cloudy",
        1102: "Mostly Cloudy",
        2000: "Fog",
        2100: "Light Fog",
        4000: "Drizzle",
        4200: "Light Rain",
        4001: "Rain",
        4201: "Heavy Rain",
        5001: "Flurries",
        5100: "Light Snow",
        5000: "Snow",
        5101: "Heavy Snow",
        6000: "Freezing Drizzle",
        6001: "Freezing Rain",
        6200: "Light Freezing Rain",
        6201: "Heavy Freezing Rain",
        8000: "Thunderstorm"
    };
    return map[code] || "Unknown";
}

function formatVisibility(value) {
    if (!value) return "Unknown";
    if (value > 10) return "Clear";
    if (value > 5) return "Moderate";
    return "Low";
}

function formatTime(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function generateAISummary(w, uvIndex) {
    let text = `Today is expected to be ${formatCondition(w.weatherCode).toLowerCase()} with a temperature around ${Math.round(w.temperature)}°C. `;
    text += `Humidity is at ${w.humidity}% and wind is ${w.windSpeed} km/h. `;
    text += w.precipitationProbability > 50
        ? `There's a high chance of rain. `
        : `Low chance of rain. `;
    text += uvIndex > 5
        ? `UV levels are high. Use sunscreen!`
        : `UV levels are moderate or low.`;
    return text;
}

