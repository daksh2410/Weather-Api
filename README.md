# TechWeather - API-Integrated Weather App

A responsive web application that fetches and displays weather data from the WeatherAPI.com with a tech-inspired design. This application includes both frontend and backend components with server-side API fetching.

## Features

- Search for weather information by city name
- Responsive design that works on mobile and desktop
- Dark/light mode toggle with persistent preference
- Loading animations during API requests
- Error handling for invalid city names
- Recent search history functionality
- Caching mechanism to reduce API calls
- Modern tech-inspired UI with blue color scheme

## Technologies Used

- HTML5
- CSS3 (with custom properties for theming)
- JavaScript (ES6+)
- WeatherAPI.com

## Setup Instructions

1. Clone or download this repository
2. Obtain a free API key from [WeatherAPI.com](https://www.weatherapi.com/)
3. Replace `YOUR_WEATHERAPI_KEY_HERE` in `server.js` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```
4. Install dependencies (if you have npm available):
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   node server.js
   ```
6. Visit `http://localhost:3000` in your browser

## Usage

1. Enter a city name in the search box
2. Click "Search" or press Enter
3. View the current weather information for the city
4. Toggle between dark/light mode using the button in the top-right corner

## Project Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Styling with responsive design
├── script.js           # Frontend JavaScript functionality
├── server.js           # Backend server with API integration
├── database.js         # Simple in-memory database for search history
├── cache.js            # Simple in-memory cache for weather data
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## API Integration

This application uses the WeatherAPI.com Current Weather API through a backend proxy:
- Frontend makes requests to `/api/weather?city={city}`
- Backend proxies requests to `https://api.weatherapi.com/v1/current.json`
- Documentation: https://www.weatherapi.com/docs/

## Customization

To customize the theme colors, modify the CSS variables in the `:root` section of `styles.css`.

## Deployment

This project can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- Render

## Future Enhancements

Potential improvements that could be made:
- Add 5-day forecast data
- Add geolocation detection
- Include more detailed weather information
- Add user authentication
- Deploy to a cloud platform with persistent database and cache

## License

This project is open source and available under the MIT License.