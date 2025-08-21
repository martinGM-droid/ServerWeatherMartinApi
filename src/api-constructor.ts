export function createLocationApiUrl(placeName:string){
      // return `https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`
      // return `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20`;
      return `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:city`;
}
export function createLocationApiUrls(placeName:string){
      return [
  `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:city`,
  `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:town`,
  `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:village`,
  `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:hamlet`,
  `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:locality`,
  `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:suburb`,
  `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:neighbourhood`
];
}

export function createWeatherApiUrl(longitude:number, latitude:number){
      return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude }&daily=temperature_2m_max,temperature_2m_min,cloudcover_max,windspeed_10m_max,weathercode&hourly=temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m,weathercode&timezone=Europe/Moscow`
}