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
const weatherConditionImageElement = document.getElementById('weatherConditionImage');
const weatherDescriptionElement = document.getElementById('weatherDescription');
const feelsLikeElement = document.getElementById('feelsLike');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const forecastStrip = document.getElementById('forecastStrip');
const decorativeBackground = document.getElementById('decorativeBackground');
const leftDecoration = document.getElementById('leftDecoration');
const rightDecoration = document.getElementById('rightDecoration');

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
    
    // Create initial decorative elements
    createDecorativeElements('sunny', 'day');
    
    // Hide weather condition image by default
    if (weatherConditionImageElement) {
        weatherConditionImageElement.style.display = 'none';
    }
    
    // Create background overlay for transparency (20% opacity as per user preference)
    createBackgroundOverlay();
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
    
    // Update background overlay for dark mode
    const overlay = document.getElementById('backgroundOverlay');
    if (overlay) {
        // Set 20% opacity (0.2) as per user preference
        if (isNowDark) {
            overlay.style.background = 'rgba(42, 42, 42, 0.2)';
        } else {
            overlay.style.background = 'rgba(245, 245, 245, 0.2)';
        }
    }
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
    
    // Weather icon has been removed as per user request
    
    weatherDescriptionElement.textContent = data.weather[0].description;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°`;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${data.wind.speed.toFixed(1)} m/s`;
    
    // Generate mock forecast data for the strip
    generateForecastStrip();
    
    // Set weather condition image based on weather condition
    setWeatherConditionImage(data.weather[0].description);
    
    // Update decorative elements based on weather and time
    const isNight = isNightTime(data);
    updateDecorativeElements(data.weather[0].description, isNight ? 'night' : 'day');
    
    hideLoading();
    showWeatherDisplay();
}

// Check if it's nighttime based on weather data
function isNightTime(data) {
    // This is a simplified check - in a real app, you'd use actual sunrise/sunset data
    const condition = data.weather[0].description.toLowerCase();
    return condition.includes('night') || condition.includes('moon');
}

// Set weather condition image based on weather condition
function setWeatherConditionImage(condition) {
    if (!weatherConditionImageElement) return;
    
    // Map weather conditions to specific images
    let imageSrc = '';
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
        imageSrc = 'conditions/Sunny.png';
    } else if (conditionLower.includes('partly cloudy') || conditionLower.includes('overcast') || conditionLower.includes('cloud')) {
        imageSrc = 'conditions/Overcast.png';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
        imageSrc = 'conditions/Rain.png';
    } else if (conditionLower.includes('snow')) {
        imageSrc = 'conditions/Snowy.png';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
        imageSrc = 'conditions/Storm.png';
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
        imageSrc = 'conditions/Foggy.png';
    } else {
        // Hide image if no matching condition
        weatherConditionImageElement.style.display = 'none';
        return;
    }
    
    // Set the image source and show the element
    weatherConditionImageElement.onload = function() {
        // Image loaded successfully
        weatherConditionImageElement.style.display = 'block';
    };
    
    weatherConditionImageElement.onerror = function() {
        // Handle image loading error
        console.error('Failed to load weather condition image:', imageSrc);
        weatherConditionImageElement.style.display = 'none';
    };
    
    weatherConditionImageElement.src = imageSrc;
    weatherConditionImageElement.alt = condition;
}

// Update map background based on weather condition
function updateMapBackground(condition) {
    const mapBackground = document.getElementById('mapBackground');
    const mapContainer = document.getElementById('mapContainer');
    if (!mapBackground || !mapContainer) return;
    
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
    mapContainer.style.background = gradient;
    
    // Add animated elements for visual interest
    createMapElements(mapBackground, condition);
    
    // Add overlay for better text readability
    // (overlay already exists in HTML)
}

// Create animated elements for the map background
function createMapElements(container, condition) {
    // Clear existing elements except overlay
    const existingElements = container.querySelectorAll('.map-element');
    existingElements.forEach(el => el.remove());
    
    // Create multiple animated elements
    for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.className = 'map-element';
        
        // Position randomly
        const size = Math.floor(Math.random() * 40) + 15;
        const posX = Math.floor(Math.random() * 80) + 10;
        const posY = Math.floor(Math.random() * 80) + 10;
        
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${posX}%`;
        element.style.top = `${posY}%`;
        
        // Style based on weather condition
        if (condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear')) {
            element.style.background = 'rgba(255, 255, 255, 0.4)';
            element.style.borderRadius = '50%';
            element.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.6)';
        } else if (condition.toLowerCase().includes('cloud')) {
            element.style.background = 'rgba(255, 255, 255, 0.5)';
            element.style.borderRadius = '50%';
            element.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.4)';
        } else if (condition.toLowerCase().includes('rain')) {
            element.style.background = 'rgba(255, 255, 255, 0.3)';
            element.style.borderRadius = '3px';
            element.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
        } else {
            element.style.background = 'rgba(255, 255, 255, 0.3)';
            element.style.borderRadius = '4px';
            element.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
        }
        
        // No animation for static display
        
        container.appendChild(element);
    }
    
    // Add a central marker to represent the city
    const cityMarker = document.createElement('div');
    cityMarker.className = 'map-element city-marker';
    cityMarker.style.width = '20px';
    cityMarker.style.height = '20px';
    cityMarker.style.left = '50%';
    cityMarker.style.top = '50%';
    cityMarker.style.transform = 'translate(-50%, -50%)';
    cityMarker.style.background = 'rgba(255, 255, 255, 0.9)';
    cityMarker.style.borderRadius = '50%';
    cityMarker.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
    cityMarker.style.zIndex = '10';
    // No animation for static display
    
    container.appendChild(cityMarker);
}

// Create decorative elements for the negative space
function createDecorativeElements(weatherCondition, timeOfDay) {
    // Clear existing decorations
    leftDecoration.innerHTML = '';
    rightDecoration.innerHTML = '';
    
    // Add base textures
    createBaseTextures();
    
    // Add topographic lines to both sides
    createTopographicLines(leftDecoration);
    createTopographicLines(rightDecoration);
    
    // Add elements based on weather condition
    if (weatherCondition.includes('sun') || weatherCondition.includes('clear')) {
        if (timeOfDay === 'day') {
            createGeometricShapes(leftDecoration, 'day');
            createGeometricShapes(rightDecoration, 'day');
        } else {
            createConstellation(leftDecoration);
            createConstellation(rightDecoration);
        }
    } else if (weatherCondition.includes('cloud')) {
        createCitySkyline(leftDecoration);
        createCitySkyline(rightDecoration);
        // Add fabric texture for cloudy days
        createFabricTexture(leftDecoration);
        createFabricTexture(rightDecoration);
    } else if (weatherCondition.includes('rain')) {
        createRainDrops(leftDecoration);
        createRainDrops(rightDecoration);
        // Add brushed metal texture for rainy days
        createBrushedMetal(leftDecoration);
        createBrushedMetal(rightDecoration);
    } else if (weatherCondition.includes('snow')) {
        createSeasonalElements(leftDecoration, 'snow');
        createSeasonalElements(rightDecoration, 'snow');
        // Add fabric texture for snowy days
        createFabricTexture(leftDecoration);
        createFabricTexture(rightDecoration);
    } else {
        createGeometricShapes(leftDecoration, timeOfDay);
        createGeometricShapes(rightDecoration, timeOfDay);
    }
    
    // Add gradient overlays
    createGradientOverlays();
}

// Update decorative elements
function updateDecorativeElements(weatherCondition, timeOfDay) {
    createDecorativeElements(weatherCondition, timeOfDay);
}

// Create topographic lines
function createTopographicLines(container) {
    const topographic = document.createElement('div');
    topographic.className = 'topographic-lines';
    container.appendChild(topographic);
}

// Create city skyline
function createCitySkyline(container) {
    const skyline = document.createElement('div');
    skyline.className = 'city-skyline';
    
    // Add some variation to the skyline
    const variation = document.createElement('div');
    variation.style.position = 'absolute';
    variation.style.bottom = '0';
    variation.style.left = '0';
    variation.style.width = '100%';
    variation.style.height = '80px';
    variation.style.background = 
        'repeating-linear-gradient(90deg, ' +
        'transparent, ' +
        'transparent 10px, ' +
        'rgba(0, 0, 0, 0.1) 10px, ' +
        'rgba(0, 0, 0, 0.1) 20px)';
    variation.style.opacity = '0.5';
    
    skyline.appendChild(variation);
    container.appendChild(skyline);
}

// Create constellation pattern
function createConstellation(container) {
    const constellation = document.createElement('div');
    constellation.className = 'constellation';
    
    // Create stars with more variation
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'constellation-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        constellation.appendChild(star);
    }
    
    // Create connecting lines with better positioning
    for (let i = 0; i < 10; i++) {
        const line = document.createElement('div');
        line.className = 'constellation-line';
        line.style.width = `${Math.random() * 60 + 20}px`;
        line.style.left = `${Math.random() * 70}%`;
        line.style.top = `${Math.random() * 70}%`;
        line.style.transform = `rotate(${Math.random() * 360}deg)`;
        constellation.appendChild(line);
    }
    
    container.appendChild(constellation);
}

// Create geometric shapes
function createGeometricShapes(container, timeOfDay) {
    const shapes = document.createElement('div');
    shapes.className = 'geometric-shapes';
    
    // Create various shapes including hexagons
    const shapeTypes = ['triangle', 'circle', 'square', 'hexagon'];
    for (let i = 0; i < 12; i++) {
        const shape = document.createElement('div');
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.className = `geometric-shape ${shapeType}`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.opacity = `${Math.random() * 0.2 + 0.05}`;
        
        // Add size variation
        if (shapeType === 'circle' || shapeType === 'square') {
            const size = Math.random() * 30 + 20;
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
        }
        
        shapes.appendChild(shape);
    }
    
    container.appendChild(shapes);
}

// Create rain drops
function createRainDrops(container) {
    // Create raindrop elements with more variation
    for (let i = 0; i < 25; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.width = `${Math.random() * 2 + 1}px`;
        drop.style.height = `${Math.random() * 25 + 15}px`;
        drop.style.background = 'rgba(100, 150, 255, 0.4)';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.borderRadius = '0 0 2px 2px';
        drop.style.boxShadow = '0 0 3px rgba(100, 150, 255, 0.6)';
        drop.style.opacity = `${Math.random() * 0.5 + 0.3}`;
        
        // No animation for static display
        
        container.appendChild(drop);
    }
}

// Create seasonal elements
function createSeasonalElements(container, season) {
    const seasonal = document.createElement('div');
    seasonal.className = 'seasonal-pattern';
    
    // Create seasonal elements
    const elementTypes = season === 'snow' ? ['snowflake'] : 
                         season === 'fall' ? ['leaf'] : 
                         season === 'spring' ? ['flower'] : ['snowflake'];
    
    for (let i = 0; i < 30; i++) {
        const element = document.createElement('div');
        element.className = `seasonal-element ${elementTypes[0]}`;
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.opacity = `${Math.random() * 0.4 + 0.1}`;
        
        // Add size variation
        const size = Math.random() * 8 + 6;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        
        seasonal.appendChild(element);
    }
    
    container.appendChild(seasonal);
}

// Create base textures
function createBaseTextures() {
    // Add brushed metal texture to both sides
    createBrushedMetal(leftDecoration);
    createBrushedMetal(rightDecoration);
}

// Create brushed metal texture
function createBrushedMetal(container) {
    const metal = document.createElement('div');
    metal.className = 'brushed-metal';
    container.appendChild(metal);
}

// Create fabric texture
function createFabricTexture(container) {
    const fabric = document.createElement('div');
    fabric.className = 'fabric-texture';
    container.appendChild(fabric);
}

// Create gradient overlays
function createGradientOverlays() {
    // Add subtle gradient overlays to both decorations
    const leftOverlay = document.createElement('div');
    leftOverlay.className = 'gradient-overlay';
    leftOverlay.style.background = 'linear-gradient(90deg, rgba(245, 245, 245, 0.5) 0%, transparent 100%)';
    leftDecoration.appendChild(leftOverlay);
    
    const rightOverlay = document.createElement('div');
    rightOverlay.className = 'gradient-overlay';
    rightOverlay.style.background = 'linear-gradient(90deg, transparent 0%, rgba(245, 245, 245, 0.5) 100%)';
    rightDecoration.appendChild(rightOverlay);
    
    // Update for dark mode if needed
    if (document.body.classList.contains('dark-mode')) {
        leftOverlay.style.background = 'linear-gradient(90deg, rgba(42, 42, 42, 0.5) 0%, transparent 100%)';
        rightOverlay.style.background = 'linear-gradient(90deg, transparent 0%, rgba(42, 42, 42, 0.5) 100%)';
    }
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

// Create background overlay with 20% opacity as per user preference
function createBackgroundOverlay() {
    // Check if overlay already exists
    let overlay = document.getElementById('backgroundOverlay');
    if (!overlay) {
        // Create overlay for transparency effect
        overlay = document.createElement('div');
        overlay.id = 'backgroundOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '-1';
        document.body.appendChild(overlay);
    }
    
    // Set 20% opacity (0.2) as per user preference
    if (document.body.classList.contains('dark-mode')) {
        overlay.style.background = 'rgba(42, 42, 42, 0.2)';
    } else {
        overlay.style.background = 'rgba(245, 245, 245, 0.2)';
    }
}

// Update the toggleDarkMode function to handle background overlay
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
    
    // Update background overlay for dark mode
    const overlay = document.getElementById('backgroundOverlay');
    if (overlay) {
        // Set 20% opacity (0.2) as per user preference
        if (isNowDark) {
            overlay.style.background = 'rgba(42, 42, 42, 0.2)';
        } else {
            overlay.style.background = 'rgba(245, 245, 245, 0.2)';
        }
    }
}