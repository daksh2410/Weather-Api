# Deployment Guide

This guide explains how to deploy the TechWeather application to various hosting platforms.

## Render Deployment

1. Create a Render account at https://render.com/
2. Fork this repository to your GitHub account
3. Log in to Render and connect your GitHub account
4. Click "New Web Service"
5. Select your forked repository
6. Configure the service:
   - Name: techweather-app
   - Environment: Node
   - Build command: `npm install`
   - Start command: `node server.js`
   - Instance type: Free
7. Add your WeatherAPI.com key as an environment variable:
   - Key: `API_KEY`
   - Value: your_actual_api_key_here
8. Click "Create Web Service"

Render will automatically deploy your application and provide a public URL.

## Vercel Deployment

1. Create a Vercel account at https://vercel.com/
2. Install Vercel CLI: `npm install -g vercel`
3. Fork this repository to your GitHub account
4. Log in to Vercel CLI: `vercel login`
5. Navigate to the project directory
6. Deploy: `vercel --prod`
7. Add your WeatherAPI.com key as an environment variable in the Vercel dashboard

## Netlify Deployment

1. Create a Netlify account at https://netlify.com/
2. Fork this repository to your GitHub account
3. Log in to Netlify and click "New site from Git"
4. Select your forked repository
5. Configure the build settings:
   - Build command: `npm run build` (if you add a build script)
   - Publish directory: `public` (or root directory)
6. Add your WeatherAPI.com key as an environment variable in the Netlify dashboard

## Environment Variables

For all deployment platforms, you'll need to set the following environment variable:

- `API_KEY`: Your WeatherAPI.com key

## Notes

- The in-memory database and cache will be reset on each deployment/restart
- For production use, replace the in-memory database with a persistent database solution
- Consider using a managed Redis service for caching in production