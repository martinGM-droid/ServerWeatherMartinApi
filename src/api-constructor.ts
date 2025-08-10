export function createLocationApiUrl(placeName:string){
      // return `https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`
      return `https://photon.komoot.io/api/?q=${encodeURIComponent(placeName)}&limit=20`;
}