export type DataStore<INTERFACE> = INTERFACE | []

type TYPE =
      | "city"
      | "locality"
      | "district"
      | "suburb"
      | "neighbourhood"
      | "quarter"
      | "farm"
      | "house"
      | "street"
      | "amenity"
      | "landuse"
      | "tourism"
      | "building";

type OSM_VALUE =
      | "city"
      | "town"
      | "village"
      | "hamlet"
      | "locality"
      | "suburb"
      | "neighbourhood"
      | "quarter"
      | "farm"
      | "house"
      | "apartment"
      | "school"
      | "hospital"
      | "bank"
      | "residential"
      | "motorway"
      | "forest"
      | "industrial"
      | "hotel"
      | "museum";

type OSM_KEY =
      | "place"
      | "building"
      | "amenity"
      | "highway"
      | "landuse"
      | "tourism";

interface FeaturesData {
      "type": "Feature",
      "properties": {
            "osm_type": string,
            "osm_id": number,
            "osm_key": OSM_KEY,
            "osm_value": OSM_VALUE,
            "type": TYPE,
            "countrycode": string,
            "name": string,
            "country": string,
            "city"?: string,
            "state": string,
            "county"?: "Всеволожский район",
            "extent"?: [
                  number,
                  number,
                  number,
                  number
            ]
      },
      "geometry": {
            "type": "Point",
            "coordinates": [
                  number,
                  number
            ]
      }
}

type Features = FeaturesData[]

export type Place =
      {
            "type": "FeatureCollection",
            "features": Features
      }



export interface GeoPoint {
      region_value: OSM_VALUE;
      region_information: {
            name: string;
            country: string;
            state: string;
      };
      region_coordinates: {
            longitude: number;
            latitude: number;
      };
}


export function parseAndFormatApiDataPlace(cashResponse: DataStore<Place[]>) {
      if (cashResponse.length === 0) return []
     return cashResponse.flatMap(item =>{
            const features = item.features
            const sorting = features.filter(data =>
                  data.properties.osm_key === 'place'
            )
            const result: GeoPoint[] = sorting
                  .filter(data => {
                        const name = data.properties.name;
                        const country = data.properties.country;
                        const state = data.properties.state
                        return name && country && state;
                  })
                  .map(data => ({
                        region_value: data.properties.osm_value,
                        region_information: {
                              name: data.properties.name,
                              country: data.properties.country,
                              state: data.properties.state
                        },
                        region_coordinates: {
                              longitude: data.geometry.coordinates[0],
                              latitude: data.geometry.coordinates[1]
                        }
                  }));
            return result
      })
}


// Open-Meteo style response
export interface WeatherApiResponse {
      latitude: number;
      longitude: number;
      generationtime_ms: number;
      utc_offset_seconds: number;
      timezone: string;                // e.g. "Europe/Moscow"
      timezone_abbreviation: string;   // e.g. "GMT+3"
      elevation: number;

      hourly_units: HourlyUnits;
      hourly: Hourly;

      daily_units: DailyUnits;
      daily: Daily;
}

// helpers
type ISODateTime = string; // "YYYY-MM-DDTHH:mm"
type ISODate = string;     // "YYYY-MM-DD"
type WMOCode = number;     // WMO weather code

interface HourlyUnits {
      time: 'iso8601';
      temperature_2m: '°C';
      relativehumidity_2m: '%';
      cloudcover: '%';
      windspeed_10m: 'km/h';
      weathercode: 'wmo code';
}

interface Hourly {
      time: ISODateTime[];
      temperature_2m: number[];
      relativehumidity_2m: number[]; // %
      cloudcover: number[];          // %
      windspeed_10m: number[];       // km/h
      weathercode: WMOCode[];
}

interface DailyUnits {
      time: 'iso8601';
      temperature_2m_max: '°C';
      temperature_2m_min: '°C';
      cloudcover_max: '%';
      windspeed_10m_max: 'km/h';
      weathercode: 'wmo code';
}

interface Daily {
      time: ISODate[];
      temperature_2m_max: number[];  // °C
      temperature_2m_min: number[];  // °C
      cloudcover_max: number[];      // %
      windspeed_10m_max: number[];   // km/h
      weathercode: WMOCode[];
}
