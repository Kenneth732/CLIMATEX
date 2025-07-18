const apiKey = 'b374050776d5cda6d0c789791abb3cd2';
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const forecastContainer = document.getElementById('forecastContainer');
const weatherBg = document.getElementById('weatherBg');
// const appContainer = document.getElementById('appContainer');
const themeToggle = document.getElementById('themeToggle');

// Dynamic Backgrounds Based on Weather
const weatherBackgrounds = {
  'clear': 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
  'clouds': 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'rain': 'linear-gradient(135deg, #6a11cb, #2575fc)',
  'snow': 'linear-gradient(135deg, #e0eafc, #cfdef3)',
  'thunderstorm': 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  'default': 'linear-gradient(135deg, #667eea, #764ba2)'
};

// Toggle Dark/Light Mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

// Fetch Weather Data
async function fetchWeather(city) {
  try {
    // Show loading state
    weatherCard.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    `;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    if (!response.ok) throw new Error('City not found');
    
    const data = await response.json();
    updateWeatherUI(data);
    // updateBackground(data.weather[0].main.toLowerCase());
  } catch (error) {
    weatherCard.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Update Weather UI
function updateWeatherUI(data) {
  const { name, sys, main, weather, wind } = data;
  
  weatherCard.innerHTML = `
    <div class="weather-display fade-in">
      <div class="location">
        <h2>${name}, ${sys.country}</h2>
        <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
      </div>
      
      <div class="weather-main">
        <div class="weather-icon">
          <i class="${getWeatherIcon(weather[0].id)}"></i>
        </div>
        <div class="temp">${Math.round(main.temp)}°C</div>
        <div class="description">${weather[0].description}</div>
      </div>
      
      <div class="weather-details">
        <div class="detail">
          <i class="fas fa-temperature-high"></i>
          <span>Feels Like: ${Math.round(main.feels_like)}°C</span>
        </div>
        <div class="detail">
          <i class="fas fa-tint"></i>
          <span>Humidity: ${main.humidity}%</span>
        </div>
        <div class="detail">
          <i class="fas fa-wind"></i>
          <span>Wind: ${wind.speed} m/s</span>
        </div>
      </div>
    </div>
  `;
}

// Update Dynamic Background
function updateBackground(weatherType) {
  const bg = weatherBackgrounds[weatherType] || weatherBackgrounds.default;
  weatherBg.style.background = bg;
}

// Get Weather Icon
function getWeatherIcon(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'fas fa-bolt';
  if (weatherId >= 300 && weatherId < 500) return 'fas fa-cloud-rain';
  if (weatherId >= 500 && weatherId < 600) return 'fas fa-umbrella';
  if (weatherId >= 600 && weatherId < 700) return 'fas fa-snowflake';
  if (weatherId >= 700 && weatherId < 800) return 'fas fa-smog';
  if (weatherId === 800) return 'fas fa-sun';
  return 'fas fa-cloud';
}

// Event Listeners
weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});