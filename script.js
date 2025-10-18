// TechWeather App JavaScript

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
const recentSearchesContainer = document.getElementById('recentSearches');

// API Configuration
const API_BASE_URL = '/api/weather';

// Check for saved dark mode preference
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') !== 'false'; // Default to dark mode
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
    }
    
    // Create dark mode toggle button
    createDarkModeToggle();
    
    // Load recent searches
    loadRecentSearches();
});

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

// Create dark mode toggle button
function createDarkModeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.innerHTML = '🌙';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(toggleButton);
    
    toggleButton.addEventListener('click', toggleDarkMode);
}

// Toggle dark mode
function toggleDarkMode() {
    const isCurrentlyDark = document.body.classList.contains('dark-mode');
    
    if (isCurrentlyDark) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('darkMode', 'false');
    } else {
        document.body.classList.remove('light-mode');
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
    // Fix: Use the correct icon URL from weatherapi.com
    weatherIconElement.src = `https:${data.weather[0].icon}`;
    weatherIconElement.alt = data.weather[0].description;
    weatherDescriptionElement.textContent = data.weather[0].description;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${data.wind.speed.toFixed(1)} m/s`;
    
    hideLoading();
    showWeatherDisplay();
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

// The real API call function is now implemented above