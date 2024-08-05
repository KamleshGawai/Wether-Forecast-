const apiKey = 'dc19329982579c0ff1fbb66eb2368f45'; // Replace 'YOUR_API_KEY' with your actual API key
const searchBtn = document.getElementById('searchBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const cityInput = document.getElementById('cityInput');
const weatherData = document.querySelector('.weather-body');
const locationNotFound = document.querySelector('.location-not-found');
const weatherImg = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const extendedForecast = document.getElementById('extended-forecast');
const forecastGrid = document.querySelector('.forecast-grid');
const cityName=document.querySelector('h2');


async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
            fetchExtendedForecast(city);
        } else {
            locationNotFound.classList.remove('hidden');
            weatherData.classList.add('hidden');
            extendedForecast.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
    locationNotFound.classList.add('hidden');
    weatherData.classList.remove('hidden');
    extendedForecast.classList.remove('hidden');
    temperature.innerHTML = `${Math.round(data.main.temp - 273.15)}°C`;
    description.innerHTML = `${data.weather[0].description}`;
    humidity.innerHTML = `${data.main.humidity}%`;
    windSpeed.innerHTML = `${data.wind.speed} m/s`;
    cityName.innerHTML=`${data.name}`;
    console.log(cityName);

    switch (data.weather[0].main) {
        case 'Clouds':
            weatherImg.src = "assets/cloud.png";
            break;
        case 'Clear':
            weatherImg.src = "assets/clear.png";
            break;
        case 'Rain':
            weatherImg.src = "assets/rain.png";
            break;
        case 'Mist':
            weatherImg.src = "assets/mist.png";
            break;
        case 'Snow':
            weatherImg.src = "assets/snow.png";
            break;
    }
}

async function fetchExtendedForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === '200') {
            displayExtendedForecast(data);
        }
    } catch (error) {
        console.error('Error fetching extended forecast:', error);
    }
}

function displayExtendedForecast(data) {
    forecastGrid.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecastGrid.innerHTML += `
            <div class="p-4 bg-white rounded-lg shadow">
                <h3 class="font-bold">${new Date(day.dt_txt).toLocaleDateString()}</h3>
                <img src="assets/${getWeatherIcon(day.weather[0].main)}.png" alt="${day.weather[0].description}" class="w-12 h-12 mx-auto">
                <p>${Math.round(day.main.temp - 273.15)}°C</p>
                <p>${day.weather[0].description}</p>
                <p>Humidity: ${day.main.humidity}%</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
            </div>
        `;
    }
}

function getWeatherIcon(weather) {
    switch (weather) {
        case 'Clouds':
            return 'cloud';
        case 'Clear':
            return 'clear';
        case 'Rain':
            return 'rain';
        case 'Mist':
            return 'mist';
        case 'Snow':
            return 'snow';
        default:
            return 'cloud';
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

currentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherCoords(latitude, longitude);
        }, error => {
            console.error('Error getting current location:', error);
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

async function fetchWeatherCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
            fetchExtendedForecastByCoords(lat, lon);
        } else {
            locationNotFound.classList.remove('hidden');
            weatherData.classList.add('hidden');
            extendedForecast.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function fetchExtendedForecastByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod === '200') {
            displayExtendedForecast(data);
        }
    } catch (error) {
        console.error('Error fetching extended forecast:', error);
    }
}
