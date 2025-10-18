// Modern Weather App JavaScript

// DOM Elements
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const weatherDisplay = document.getElementById('weatherDisplay');
const cityNameElement = document.getElementById('cityName');
const temperatureElement = document.getElementById('temperature');
const weatherIconElement = document.getElementById('weatherIcon');
const weatherDescriptionElement = document.getElementById('weatherDescription');
const feelsLikeElement = document.getElementById('feelsLike');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const forecastStrip = document.getElementById('forecastStrip');

// API Configuration
const API_BASE_URL = '/api/weather';

// Check for saved dark mode preference
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') !== 'false'; // Default to dark mode
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Create dark mode toggle button
    createDarkModeToggle();
    
    // Load recent searches
    loadRecentSearches();
});

// Create dark mode toggle button
function createDarkModeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.innerHTML = '🌙';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(toggleButton);
    
    // Set initial icon based on mode
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.innerHTML = '☀️';
    } else {
        toggleButton.innerHTML = '🌙';
    }
    
    toggleButton.addEventListener('click', toggleDarkMode);
}

// Toggle dark mode
function toggleDarkMode() {
    const isCurrentlyDark = document.body.classList.contains('dark-mode');
    
    if (isCurrentlyDark) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    }
    
    // Update button icon
    const toggleButton = document.querySelector('.dark-mode-toggle');
    const isNowDark = document.body.classList.contains('dark-mode');
    toggleButton.innerHTML = isNowDark ? '☀️' : '🌙';
}

// Form submission handler
weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    await fetchWeatherData(city);
});

// Fetch weather data from API
async function fetchWeatherData(city) {
    try {
        // Show loading, hide previous results
        showLoading();
        hideError();
        hideWeatherDisplay();
        
        const response = await fetch(`${API_BASE_URL}?city=${city}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Display weather data
        displayWeatherData(data);
        
        // Refresh recent searches
        loadRecentSearches();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message || 'Failed to fetch weather data. Please try again.');
    }
}

// Display weather data
function displayWeatherData(data) {
    cityNameElement.textContent = `${data.name}, ${data.sys.country}`;
    temperatureElement.textContent = Math.round(data.main.temp);
    
    // Handle weather icon - use the correct icon URL from weatherapi.com
    if (data.weather[0].icon) {
        // WeatherAPI.com provides full URLs, so we can use them directly
        weatherIconElement.src = data.weather[0].icon.startsWith('http') ? 
            data.weather[0].icon : `https:${data.weather[0].icon}`;
        weatherIconElement.alt = data.weather[0].description;
    } else {
        // Fallback to a default icon if none is provided
        weatherIconElement.src = 'https://cdn.weatherapi.com/weather/64x64/day/113.png';
        weatherIconElement.alt = 'Weather icon';
    }
    
    weatherDescriptionElement.textContent = data.weather[0].description;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°`;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${data.wind.speed.toFixed(1)} m/s`;
    
    // Generate mock forecast data for the strip
    generateForecastStrip();
    
    hideLoading();
    showWeatherDisplay();
}

// Generate mock forecast data for the strip
function generateForecastStrip() {
    // Clear previous forecast
    forecastStrip.innerHTML = '';
    
    // Generate 5 days of mock forecast data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const temps = [22, 24, 21, 23, 25];
    const icons = [
        'https://cdn.weatherapi.com/weather/64x64/day/113.png',
        'https://cdn.weatherapi.com/weather/64x64/day/116.png',
        'https://cdn.weatherapi.com/weather/64x64/day/119.png',
        'https://cdn.weatherapi.com/weather/64x64/day/122.png',
        'https://cdn.weatherapi.com/weather/64x64/day/143.png'
    ];
    
    for (let i = 0; i < 5; i++) {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-day">${days[i]}</div>
            <img class="forecast-icon" src="${icons[i]}" alt="Weather icon">
            <div class="forecast-temp">${temps[i]}°</div>
        `;
        forecastStrip.appendChild(forecastItem);
    }
}

// Load recent searches from backend
async function loadRecentSearches() {
    try {
        const response = await fetch('/api/recent');
        if (response.ok) {
            const recentCities = await response.json();
            displayRecentSearches(recentCities);
        }
    } catch (error) {
        console.error('Failed to load recent searches:', error);
    }
}

// Display recent searches
function displayRecentSearches(cities) {
    const searchTagsContainer = document.getElementById('searchTags');
    
    if (cities.length === 0) {
        searchTagsContainer.innerHTML = '<p>No recent searches</p>';
        return;
    }
    
    searchTagsContainer.innerHTML = '';
    
    cities.forEach(city => {
        const tag = document.createElement('div');
        tag.className = 'search-tag';
        tag.textContent = city;
        tag.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeatherData(city);
        });
        searchTagsContainer.appendChild(tag);
    });
}

// Show loading indicator
function showLoading() {
    loadingElement.classList.remove('hidden');
}

// Hide loading indicator
function hideLoading() {
    loadingElement.classList.add('hidden');
}

// Show error message
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.remove('hidden');
    hideLoading();
}

// Hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Show weather display
function showWeatherDisplay() {
    weatherDisplay.classList.remove('hidden');
}

// Hide weather display
function hideWeatherDisplay() {
    weatherDisplay.classList.add('hidden');
}