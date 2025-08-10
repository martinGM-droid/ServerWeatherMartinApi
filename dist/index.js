import express from 'express';
import cors from 'cors';
import { createLocationApiUrl } from './api-constructor.js';
import { ApiManager } from './class-constructor.js';
import { PORT, origin } from './config.js';
const app = express();
app.use(cors({
    origin: origin
}));
app.get('/search', async (req, res) => {
    const cash = [{
            type: "FeatureCollection",
            features: []
        }];
    const placeName = req.query.q;
    const path = 'data/coordinates.json';
    const urlSearchPlace = createLocationApiUrl(placeName);
    const placeInfoClass = new ApiManager(urlSearchPlace, cash);
    await placeInfoClass.getRequest();
    await placeInfoClass.createFile(path);
    setTimeout(() => {
        console.log(urlSearchPlace);
        console.log(cash);
        console.log(cash.length);
        // console.log(cash[0].feyatures)
    }, 100);
    res.status(200).json({ message: `Hello ${placeName}` });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
