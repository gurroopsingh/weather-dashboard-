const API_KEY = "c8b5a5d7443b4bcbb6f91819263006";

// Auth Check
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "index.html";
});

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const notification = document.getElementById("notification");
const loading = document.getElementById("loading");
const weatherDisplay = document.getElementById("weatherDisplay");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

function showNotification(message, type = "error") {
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    // Auto hide after 4 seconds
    setTimeout(() => {
        notification.className = "notification hidden";
    }, 4000);
}

function updateBackground(conditionText, isDay) {
    const text = conditionText.toLowerCase();
    let bgClass = "default-bg";

    if (!isDay) {
        bgClass = "night-bg";
    } else if (text.includes("sun") || text.includes("clear")) {
        bgClass = "sunny-bg";
    } else if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) {
        bgClass = "rainy-bg";
    } else if (text.includes("cloud") || text.includes("overcast") || text.includes("mist")) {
        bgClass = "cloudy-bg";
    } else if (text.includes("snow") || text.includes("ice") || text.includes("blizzard")) {
        bgClass = "snowy-bg";
    }

    document.body.className = bgClass;
}

async function getWeather(city) {
    if (city === "") {
        showNotification("Please enter a city name.", "error");
        return;
    }

    try {
        searchBtn.disabled = true;
        loading.classList.remove("hidden");
        weatherDisplay.classList.add("hidden");
        notification.classList.add("hidden");

        // Fetch 3-day forecast
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
        );

        const data = await response.json();

        if (data.error) {
            showNotification(data.error.message, "error");
            return;
        }

        // Save to localStorage
        localStorage.setItem("lastCity", city);

        // Update Current Weather
        cityName.textContent = `${data.location.name}, ${data.location.country}`;
        temperature.textContent = `${data.current.temp_c}°C`;
        condition.textContent = data.current.condition.text;
        humidity.textContent = `${data.current.humidity}%`;
        wind.textContent = `${data.current.wind_kph} km/h`;
        feelsLike.textContent = `${data.current.feelslike_c}°C`;
        
        weatherIcon.innerHTML = `<img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">`;

        // Update Background
        updateBackground(data.current.condition.text, data.current.is_day);

        // Update 3-Day Forecast
        forecastContainer.innerHTML = ""; // Clear existing
        
        data.forecast.forecastday.forEach(dayData => {
            // Get day name (e.g., Mon, Tue)
            const date = new Date(dayData.date);
            const dayName = date.toLocaleDateString("en-US", { weekday: 'short' });

            const card = document.createElement("div");
            card.className = "forecast-card glass-panel";
            card.innerHTML = `
                <h3>${dayName}</h3>
                <img src="https:${dayData.day.condition.icon}" alt="Forecast Icon">
                <p class="forecast-temp">${dayData.day.avgtemp_c}°C</p>
                <p class="forecast-cond">${dayData.day.condition.text}</p>
            `;
            forecastContainer.appendChild(card);
        });

        // Show content
        weatherDisplay.classList.remove("hidden");

    } catch (error) {
        showNotification("Unable to fetch weather. Please check your connection.", "error");
        console.error(error);
    } finally {
        searchBtn.disabled = false;
        loading.classList.add("hidden");
    }
}

searchBtn.addEventListener("click", function () {
    getWeather(searchInput.value.trim());
});

searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather(searchInput.value.trim());
    }
});

// On Load
document.addEventListener("DOMContentLoaded", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        searchInput.value = lastCity;
        getWeather(lastCity);
    }
});