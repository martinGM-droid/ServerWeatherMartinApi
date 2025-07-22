import fs from 'fs/promises'; // добавь импорт
export async function fetchData(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,cloud_cover&timezone=Europe%2FMoscow`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Get Data:', data);
        // Сохраняем объект в файл data/weather.json
        await fs.writeFile('data/weather.json', JSON.stringify(data, null, 2), 'utf-8');
        console.log('Данные сохранены в data/weather.json');
        return data;
    }
    catch (e) {
        console.log(e);
    }
}
