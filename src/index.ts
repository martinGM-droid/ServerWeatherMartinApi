import express from 'express';
import cors from 'cors';
import { createLocationApiUrl, createWeatherApiUrl, queryTags } from './api-constructor.js';
import { ApiManager,  DistributorResponse, File } from './сoreApiManager.js';
import { DataStore, Place, GeoPoint, WeatherApiResponse } from './data-processing.js';
import { PORT, origin } from './config.js';
import { parseAndFormatApiDataPlace } from './data-processing.js';
import { TestPost, DebugError } from './debug.js';
const app = express();
app.use(express.json())
app.use(cors({
  origin: origin
}));

app.get('/search', async (req, res) => {
  try {
    const placeName = req.query.q as string;
    const path = 'data/coordinates.json'
    const pathPrefix = 'data/coordinates.json'
    const urlSearchPlace = createLocationApiUrl(placeName)
    const PlaceInfoClass = new ApiManager(urlSearchPlace);
    const placeInfo:DistributorResponse<Place> = await PlaceInfoClass.getRequest(queryTags)
    const placeInfoData = placeInfo.data
    const placeInfoDebug= placeInfo.debugError
    const placeInfoError= placeInfo.error
    console.log('DATA',placeInfoData)
    console.log('DEBUG',placeInfoDebug)
    console.log('ERROR',placeInfoError)
    const results = parseAndFormatApiDataPlace(placeInfoData)
    console.log('TEST',results)
    console.log('TEST-L',results.length)
    res.status(200).json(results);
  } catch (error) {
    if (error instanceof DebugError) {
      res.status(error.statusCode).json({ error: error.message })
    } else {//* unknown error → 500
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});



app.post('/weather', async (req, res) => {
  const cash: DataStore<WeatherApiResponse[]> = [];
  const path = 'data/weather.json'
  const data: [GeoPoint] = req.body;
  console.log('data:', data)
  const longitude = data[0].region_coordinates.longitude
  const latitude = data[0].region_coordinates.latitude
  const weatherReqwest = createWeatherApiUrl(longitude, latitude)
  const weatherInfoClass = new ApiManager<DataStore<WeatherApiResponse[]>>(weatherReqwest, cash)
  await weatherInfoClass.getRequest()
  res.status(200).json({ message: 'weather by region' })
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});