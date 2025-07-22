import express from 'express';
// import fs from 'fs/promises'; // добавь импорт
import { fetchData } from './data-fetching.js';
import { WeatherData } from './data-processing.js';
import { weatherByTimeObjectCreate } from './data-processing.js';
import { WeatherTimeArrayFrontiend } from './data-processing.js';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});



// export const weatherData: WeatherData = await fetchData(53.66, 23.81);
export const weatherData: WeatherData = await fetchData(53.67462, 23.82958);

const weatherDataResult:WeatherTimeArrayFrontiend = await weatherByTimeObjectCreate()

console.log(weatherDataResult)


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});