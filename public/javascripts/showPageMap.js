mapboxgl.accessToken = mapToken
const data = JSON.parse(campground)
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: data.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(data.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${data.title}</h3><p>${data.location}</p>`
            )
    )
    .addTo(map)