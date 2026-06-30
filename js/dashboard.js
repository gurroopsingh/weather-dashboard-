const API_KEY = "c8b5a5d7443b4bcbb6f91819263006";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");

async function getWeather(city){

    if(city === ""){
        alert("Please enter a city name.");
        return;
    }

    try{

        searchBtn.disabled = true;
        searchBtn.textContent = "Loading...";

        const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
);

        const data = await response.json();

        if(data.error){
            alert(data.error.message);
            return;
        }

        cityName.textContent = `${data.location.name}, ${data.location.country}`;

        temperature.textContent = `${data.current.temp_c}°C`;

        condition.textContent = data.current.condition.text;

        humidity.textContent = `${data.current.humidity}%`;

        wind.textContent = `${data.current.wind_kph} km/h`;

        feelsLike.textContent = `${data.current.feelslike_c}°C`;

        weatherIcon.innerHTML =
        `<img src="https:${data.current.condition.icon}" alt="Weather Icon">`;

    }

    catch(error){

        alert("Unable to fetch weather.");

        console.log(error);

    }

    finally{

        searchBtn.disabled = false;

        searchBtn.textContent = "Search";

    }

}

searchBtn.addEventListener("click",function(){

    getWeather(searchInput.value.trim());

});

searchInput.addEventListener("keypress",function(event){

    if(event.key==="Enter"){

        getWeather(searchInput.value.trim());

    }

});