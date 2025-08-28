export function createLocationApiUrl(placeName:string){
      return `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20`;
}
// export function createLocationApiUrls(placeName:string){
//       return [
//   `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:city`,
//   `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:town`,
//   `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:village`,
//   `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:hamlet`,
//   `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:locality`,
//   `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:suburb`,
//   `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20&osm_tag=place:neighbourhood`
// ];
// }

export const queryTags = [ 
  '&osm_tag=place:city',
  '&osm_tag=place:town',
  '&osm_t',
  '&osm_tag=place:hamlet',
  '&osm_tag=place:locality',
  '&osm_t',
  '&osm_tag=place:neighbourhood'
];


// export const queryTags = [
//   '&osm_tag=place:city',
//   '&osm_tag=place:town',
//   '&osm_tag=place:village',
//   '&osm_tag=place:hamlet',
//   '&osm_tag=place:locality',
//   '&osm_tag=place:suburb',
//   '&osm_tag=place:neighbourhood'
// ];

export function createWeatherApiUrl(longitude:number, latitude:number){
      return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude }&daily=temperature_2m_max,temperature_2m_min,cloudcover_max,windspeed_10m_max,weathercode&hourly=temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m,weathercode&timezone=Europe/Moscow`
}