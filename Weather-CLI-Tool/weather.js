require('dotenv').config();
const axios = require('axios');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
    .option('city', {
        alias: 'c',
        type: 'string',
        description: 'City name to get the weather for',
    })
    .help()
    .alias('help', 'h')
    .argv;

if (!argv.city) {
    console.log('Please provide a city name with --city or -c');
    process.exit(1);
}

const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${argv.city}&appid=${API_KEY}&units=metric`;

axios.get(API_URL)
    .then(response => {
        const weather = response.data;
        console.log(`\nWeather in ${weather.name}:`);
        console.log(`- Temperature: ${weather.main.temp}°C`);
        console.log(`- Feels like: ${weather.main.feels_like}°C`);
        console.log(`- Humidity: ${weather.main.humidity}%`);
        console.log(`-Wind: ${weather.wind.speed} m/s`);
        console.log(`- Conditions: ${weather.weather[0].description}\n`);
    })
    .catch(error => {
        console.error('Error fetching weather:', error.response?.data.message || error.message);
    });