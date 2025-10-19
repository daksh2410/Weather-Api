# TechWeather

A responsive web application that fetches and displays weather data from WeatherAPI.com with a tech-inspired design. This repository contains both frontend and backend components with server-side API fetching.

---

## Problem statement

Build a small, responsive weather application that allows users to search for a city's current weather information. The app should provide a modern, tech-inspired UI, handle errors gracefully, support light/dark themes with persistent user preference, and minimize API calls through caching.

---

## Features

* Search for weather information by city name
* Responsive UI for mobile and desktop
* Dark / Light mode toggle with persistent preference
* Loading animations while fetching data
* Error handling for invalid city names
* Recent search history
* Simple caching to reduce API calls
* Minimalistic theme with cutomization of dark mode and light mode

---

## Tech stack used

* **Frontend:** HTML5, CSS3 (custom properties), Vanilla JavaScript (ES6+)
* **Backend:** Node.js (Express) server proxying requests to WeatherAPI.com
* **API:** WeatherAPI.com (Current Weather endpoint)
* **Other:** Simple in-memory cache & search-history (demo purpose)

---

## Files & Project Structure

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

---

## Steps to run the project (local)

1. Clone the repo:

   ```bash
   git clone <your-github-repo-url>
   cd <repo-folder>
   ```
2. Obtain a free API key from [WeatherAPI.com](https://www.weatherapi.com/).
3. Open `server.js` and replace the placeholder with your API key:

   ```js
   const API_KEY = 'YOUR_WEATHERAPI_KEY_HERE';
   ```
4. Install dependencies:

   ```bash
   npm install
   ```
5. Start the server:

   ```bash
   node server.js
   ```
6. Open your browser and visit:

   ```
   http://localhost:3000
   ```

---

## Screenshots / Demo

<img width="2823" height="1450" alt="image" src="https://github.com/user-attachments/assets/fa814cc7-ecd5-4efe-a7c5-5668c6347e9e" />
<img width="2825" height="1453" alt="Screenshot 2025-10-19 120120" src="https://github.com/user-attachments/assets/d03d20d9-ab20-48c4-bc33-1c9419d4d3a7" />
<img width="680" height="1251" alt="Screenshot 2025-10-19 120103" src="https://github.com/user-attachments/assets/2a1544cc-8792-43a1-9a76-0bb1b5661051" />
<img width="2853" height="1455" alt="Screenshot 2025-10-19 120044" src="https://github.com/user-attachments/assets/6bfcca9b-6648-4cc1-a8f9-129dc2fd8823" />






---

## Deployment

**Deployment URL:** : https://techweather-app.onrender.com   

---

## API Integration

* The frontend calls: `/api/weather?city={city}`
* The backend proxies to: `https://api.weatherapi.com/v1/current.json` (see WeatherAPI docs)
* Replace API key before running locally or add it as an environment variable





