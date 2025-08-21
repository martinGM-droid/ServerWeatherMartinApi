import express from 'express';
import cors from 'cors';
import { createLocationApiUrl, createWeatherApiUrl, createLocationApiUrls } from './api-constructor.js';
import { ApiManager } from './сoreApiManager.js';
import { ClassCash, Place, GeoPoint, WeatherApiResponse } from './data-processing.js';
import { PORT, origin } from './config.js';
import { parseAndFormatApiDataPlace } from './data-processing.js';
import { TestPost, DebugError } from './debug.js';
const app = express();
app.use(express.json())
app.use(cors({
  origin: origin
}));

app.get('/search', async (req, res) => {
  try{
    const cash: ClassCash<Place> = []
    const placeName = req.query.q as string;
    const path = 'data/coordinates.json'
    const pathPrefix = 'data/coordinates.json'
    const urlSearchPlace = createLocationApiUrl(placeName)
    const urlsSearchPlace = createLocationApiUrls(placeName)
    const placeInfoClass = new ApiManager<ClassCash<Place>>(urlSearchPlace, cash);
    await placeInfoClass.getRequest()
    await placeInfoClass.createFile(path)
    await placeInfoClass.multiRequests(urlsSearchPlace)
    await placeInfoClass.multiCreateFile(pathPrefix)
    const results = parseAndFormatApiDataPlace(cash)
    // setTimeout(() => {
    //   console.log(urlSearchPlace)
    //   console.log(cash)
    //   console.log(cash.length)
    //   console.log('FILT', results)
    // }, 100);
    console.log('start',cash, 'End')
    console.log('test',results[0])
    console.log('testAll',results)
    await TestPost([results[0]],PORT, 'weather')
    res.status(200).json(results);
  }catch(error){
    if(error instanceof DebugError){
      res.status(error.statusCode).json({error: error.message})
    }else {//* unknown error → 500
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
});



app.post('/weather', async (req, res)=>{
  const cash: ClassCash<WeatherApiResponse[]> = [];
  const path = 'data/weather.json'
  const data:[GeoPoint] = req.body;
  console.log('data:',data)
  const longitude = data[0].region_coordinates.longitude
  const latitude = data[0].region_coordinates.latitude
  const weatherReqwest = createWeatherApiUrl(longitude, latitude)
  const weatherInfoClass = new ApiManager<ClassCash<WeatherApiResponse[]>>(weatherReqwest, cash)
  await weatherInfoClass.getRequest()
  await weatherInfoClass.createFile(path)
  res.status(200).json({message: 'weather by region'})
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});