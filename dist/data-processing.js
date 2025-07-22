import { weatherData } from './index';
const { hourly: { time, temperature_2m, precipitation_probability, precipitation, cloud_cover, } } = weatherData;
console.log('Time:', time);
console.log('Temperature 2m:', temperature_2m);
console.log('Precipitation Probability:', precipitation_probability);
console.log('Precipitation:', precipitation);
console.log('Cloud Cover:', cloud_cover);
// interface WeatherDataByTime {
// }
