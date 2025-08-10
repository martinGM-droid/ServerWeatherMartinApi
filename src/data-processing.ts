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

export type Place = [
      {
            "type": "FeatureCollection",
            "features": Features
      }
]


function parseAndFormatApiDataPlace(cashResponse:Place) {

}
