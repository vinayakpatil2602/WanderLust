

//receive maptoken and coordinates datas from show.ejs
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});


const marker= new mapboxgl.Marker()
        .setLngLat(coordinates)//listing//geometrq//coordinates
        .addTo(map);
