export function parseAndFormatApiDataPlace(cashResponse) {
    if (cashResponse.length === 0)
        return [];
    return cashResponse.flatMap(item => {
        const features = item.features;
        const sorting = features.filter(data => data.properties.osm_key === 'place');
        const result = sorting
            .filter(data => {
            const name = data.properties.name;
            const country = data.properties.country;
            const state = data.properties.state;
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
        return result;
    });
}
