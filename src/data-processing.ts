import { weatherData } from './index';

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    precipitation_probability: string;
    precipitation: string;
    cloud_cover: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    cloud_cover: number[];
  };
}


const {
  hourly: {
    time,
    temperature_2m,
    precipitation_probability,
    precipitation,
    cloud_cover,
  }
} = weatherData;


console.log('Time:', time);
console.log('Temperature 2m:', temperature_2m);
console.log('Precipitation Probability:', precipitation_probability);
console.log('Precipitation:', precipitation);
console.log('Cloud Cover:', cloud_cover);


// interface WeatherDataByTime {

// }