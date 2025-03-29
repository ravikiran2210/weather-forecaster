const API_KEY = '75926732325fd00c6922fa4365449e85';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        // Get current weather
        const response = await fetch(`${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found. Please try again.');
            return;
        }

        // Update current weather display
        document.getElementById('currentTemp').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
        document.getElementById('minTemp').textContent = `${Math.round(data.main.temp_min)}°C`;
        document.getElementById('maxTemp').textContent = `${Math.round(data.main.temp_max)}°C`;
        document.getElementById('humidity').textContent = `${Math.round(data.main.humidity)}%`;
        document.getElementById('weatherDesc').textContent = data.weather[0].description;

        // Get 5-day forecast
        const forecastResponse = await fetch(`${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();

        // Display future predictions
        displayFuturePredictions(forecastData.list);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function displayFuturePredictions(forecastList) {
    const predictionsContainer = document.getElementById('futurePredictions');
    predictionsContainer.innerHTML = ''; 

    
    const nextPredictions = forecastList.slice(0, 5);

    nextPredictions.forEach(prediction => {
        const time = new Date(prediction.dt * 1000);
        const timeString = time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        const predictionCard = document.createElement('div');
        predictionCard.className = 'prediction-card';
        predictionCard.innerHTML = `
            <div class="time">${timeString}</div>
            <div class="temp">${Math.round(prediction.main.temp)}°C</div>
        `;
        predictionsContainer.appendChild(predictionCard);
    });
}

// Add event listener for Enter key
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
}); 