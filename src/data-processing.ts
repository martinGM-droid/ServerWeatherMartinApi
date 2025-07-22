import { weatherData } from './index.js';
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

interface WeatherTimeObjectFrontiend{
    time: string;
    temperature_2m: number;
    precipitation_probability: number;
    precipitation: number;
    cloud_cover: number;
}

export type WeatherTimeArrayFrontiend = WeatherTimeObjectFrontiend[];
  



export async function weatherByTimeObjectCreate():Promise<WeatherTimeArrayFrontiend>  {
  const {
    hourly: {
      time,
      temperature_2m,
      precipitation_probability,
      precipitation,
      cloud_cover,
    }
  } = weatherData;
  
  const result: WeatherTimeArrayFrontiend = [];

  for (let i = 0; i < time.length; i++) {
    result.push({
      time: time[i],
      temperature_2m: temperature_2m[i],
      precipitation_probability: precipitation_probability[i],
      precipitation: precipitation[i],
      cloud_cover: cloud_cover[i]
    });
  }
  return result
}

