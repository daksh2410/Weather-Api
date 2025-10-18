const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const database = require('./database');
const cache = require('./cache');

const PORT = 3000;
// Load configuration
const config = require('./config.example');

// Replace with your actual API key from weatherapi.com
const API_KEY = config.WEATHERAPI_KEY || 'YOUR_WEATHERAPI_KEY_HERE';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Handle API proxy endpoint
  if (pathname === '/api/weather' && req.method === 'GET') {
    const city = parsedUrl.query.city;
    if (!city) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'City parameter is required' }));
      return;
    }
    
    // Add search to history
    database.addSearch(city);
    
    fetchWeatherData(city, res);
    return;
  }
  
  // Handle search history endpoint
  if (pathname === '/api/history' && req.method === 'GET') {
    const history = database.getSearchHistory(10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(history));
    return;
  }
  
  // Handle recent cities endpoint
  if (pathname === '/api/recent' && req.method === 'GET') {
    const recent = database.getRecentCities(5);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(recent));
    return;
  }
  
  let filePath = '.' + pathname;
  
  // Serve index.html for root path
  if (filePath === './') {
    filePath = './index.html';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        fs.readFile('./404.html', (err, content404) => {
          if (err) {
            // No 404 page, send plain text response
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found', 'utf-8');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content404, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Function to fetch weather data from weatherapi.com
function fetchWeatherData(city, res) {
  console.log(`Fetching weather data for: ${city}`);
  
  // Check cache first
  const cachedData = cache.get(city.toLowerCase());
  if (cachedData) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cachedData));
    return;
  }
  
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
  
  https.get(apiUrl, (apiRes) => {
    let data = '';
    
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    
    apiRes.on('end', () => {
      try {
        const weatherData = JSON.parse(data);
        
        if (weatherData.error) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: weatherData.error.message || 'City not found' }));
          return;
        }
        
        // Transform weatherapi.com response to match our frontend expectations
        const transformedData = {
          name: weatherData.location.name,
          sys: {
            country: weatherData.location.country
          },
          main: {
            temp: weatherData.current.temp_c,
            feels_like: weatherData.current.feelslike_c,
            humidity: weatherData.current.humidity
          },
          weather: [
            {
              description: weatherData.current.condition.text,
              icon: weatherData.current.condition.icon.split('/').pop()
            }
          ],
          wind: {
            speed: weatherData.current.wind_kph / 3.6 // Convert kph to m/s
          }
        };
        
        // Cache the response
        cache.set(city.toLowerCase(), transformedData);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(transformedData));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse weather data' }));
      }
    });
  }).on('error', (error) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to connect to weather service' }));
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});