import {LatLngExpression} from "leaflet";

const getCenter = (coordinates: [number, number][]) => {
    const lat = coordinates.reduce((acc, coord) => acc + coord[0], 0) / coordinates.length;
    const lng = coordinates.reduce((acc, coord) => acc + coord[1], 0) / coordinates.length;
    return [lat, lng] as LatLngExpression;
};

export default getCenter