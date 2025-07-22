import { weatherData } from './index.js';
export async function weatherByTimeObjectCreate() {
    const { hourly: { time, temperature_2m, precipitation_probability, precipitation, cloud_cover, } } = weatherData;
    const result = [];
    for (let i = 0; i < time.length; i++) {
        result.push({
            time: time[i],
            temperature_2m: temperature_2m[i],
            precipitation_probability: precipitation_probability[i],
            precipitation: precipitation[i],
            cloud_cover: cloud_cover[i]
        });
    }
    return result;
}
