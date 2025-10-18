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
    
    // Update map background based on weather condition
    updateMapBackground(data.weather[0].description);
    
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

// Update map background based on weather condition
function updateMapBackground(condition) {
    const mapBackground = document.getElementById('mapBackground');
    if (!mapBackground) return;
    
    // Clear previous content
    mapBackground.innerHTML = '';
    
    // Add weather-specific styling
    let gradient;
    if (condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear')) {
        gradient = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)';
    } else if (condition.toLowerCase().includes('cloud')) {
        gradient = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
    } else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
        gradient = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    } else if (condition.toLowerCase().includes('snow')) {
        gradient = 'linear-gradient(135deg, #c2e59c 0%, #64b3f4 100%)';
    } else if (condition.toLowerCase().includes('storm')) {
        gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else {
        // Default gradient
        gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    // Set the background
    mapBackground.style.background = gradient;
    
    // Add animated elements for visual interest
    createMapElements(mapBackground, condition);
    
    // Add overlay for better text readability
    const overlay = document.createElement('div');
    overlay.className = 'map-overlay';
    mapBackground.appendChild(overlay);
}

// Create animated elements for the map background
function createMapElements(container, condition) {
    // Create multiple animated elements
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'map-element';
        
        // Position randomly
        const size = Math.floor(Math.random() * 30) + 10;
        const posX = Math.floor(Math.random() * 80) + 10;
        const posY = Math.floor(Math.random() * 80) + 10;
        
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${posX}%`;
        element.style.top = `${posY}%`;
        
        // Style based on weather condition
        if (condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear')) {
            element.style.background = 'rgba(255, 255, 255, 0.3)';
            element.style.borderRadius = '50%';
            element.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
        } else if (condition.toLowerCase().includes('cloud')) {
            element.style.background = 'rgba(255, 255, 255, 0.4)';
            element.style.borderRadius = '50%';
            element.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
        } else if (condition.toLowerCase().includes('rain')) {
            element.style.background = 'rgba(255, 255, 255, 0.2)';
            element.style.borderRadius = '2px';
            element.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
        } else {
            element.style.background = 'rgba(255, 255, 255, 0.2)';
            element.style.borderRadius = '3px';
            element.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
        }
        
        // Add animation
        const duration = Math.floor(Math.random() * 10) + 10;
        element.style.animation = `floatMap ${duration}s infinite ease-in-out`;
        element.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(element);
    }
}