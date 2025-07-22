import express from 'express';
// import fs from 'fs/promises'; // добавь импорт
import { fetchData } from './data-fetching';
import { WeatherData } from './data-processing';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});



export const weatherData: WeatherData = await fetchData(53.66, 23.81);






app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});