import * as mapboxgl from 'mapbox-gl';
const mapboxKey = 'pk.eyJ1IjoibWljYWhiYWxlcyIsImEiOiJjaXg4OTlrNHgwMDAyMnlvNDRleXBrdGNrIn0.d3eUGWL--AriB6n5MXy5TA';
(mapboxgl as any).accessToken = mapboxKey;

export const createMap = () => (
    new mapboxgl.Map({
        container: 'primary-map',
        style: 'mapbox://styles/micahbales/cjnx84jgd0viy2sojoy624r6k',
        center: { lng: -98.585522, lat: 39.8333333 },
        zoom: 10
    })
);
