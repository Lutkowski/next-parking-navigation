'use client'

import 'leaflet/dist/leaflet.css'
import {MapContainer, TileLayer, Polygon, Marker, Popup, Polyline} from 'react-leaflet';
import {LatLngExpression} from "leaflet";
import {Icon} from 'leaflet'
import {FacilityType} from "@/models/Facility";
import {useMapData} from "@/hooks/useMapData";
import Zoom from "@/components/ui/zoom/Zoom";

const Map = () => {

    const initialPosition: [number, number] = [56.306470, 44.075805];
    const { parkingPlaces, shops, voids, placements, borders, facilities } = useMapData();


    const customIcons: { [key in FacilityType]: Icon } = {
        [FacilityType.Elevator]: new Icon({
            iconUrl: '/elevator.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }),
        [FacilityType.EscalatorUp]: new Icon({
            iconUrl: '/escalator_up.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }),
        [FacilityType.EscalatorDown]: new Icon({
            iconUrl: '/escalator_down.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }),
        [FacilityType.Entrance]: new Icon({
            iconUrl: '/entrance.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        }),
    };

    return (
        <div>
            <MapContainer
                center={initialPosition}
                minZoom={18}
                zoom={18}
                zoomControl={false}
                style={{height: '100vh', width: '100%'}}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a> contributors'
                    maxNativeZoom={19}
                    maxZoom={21}
                />

                <Zoom/>

                {parkingPlaces.map((path) => (
                    <Polygon
                        key={path._id}
                        positions={path.coordinates as LatLngExpression[]}
                        color='red'
                        className='cars'
                        eventHandlers={{
                            mouseover: (event) => event.target.setStyle({color: 'blue'}),
                            mouseout: (event) => event.target.setStyle({color: 'red'}),
                        }}
                    />
                ))}

                {shops.map((shop) => (
                    <Polygon
                        key={shop._id}
                        positions={shop.coordinates as LatLngExpression[]}
                        pathOptions={{
                            color: 'rgba(255, 165, 0, 0.5)',
                            weight: 3,
                            fillColor: 'yellow',
                        }}
                        className='shops'
                        eventHandlers={{
                            mouseover: (event) => event.target.setStyle({color: 'rgba(255, 165, 0, 1)'}),
                            mouseout: (event) => event.target.setStyle({color: 'rgba(255, 165, 0, 0.5)'}),
                        }}
                    >
                        <Popup>{shop.slug}</Popup>
                    </Polygon>
                ))}

                {voids.map((path) => (
                    <Polygon
                        key={path._id}
                        positions={path.coordinates as LatLngExpression[]}
                        color='rgba(127, 127, 127, 0.4)'
                    />
                ))}

                {placements.map((path) => (
                    <Polygon
                        key={path._id}
                        positions={path.coordinates as LatLngExpression[]}
                        color='rgba(127, 127, 127, 1)'
                    />
                ))}

                {facilities.map((facility) => (
                    <Marker
                        key={facility._id}
                        icon={customIcons[facility.type]}
                        position={facility.coordinate as LatLngExpression}
                    >
                        <Popup>{facility.type}</Popup>
                    </Marker>
                ))}

                {borders.map((border) => (
                    <Polyline
                        key={border._id}
                        positions={border.coordinates as LatLngExpression[]}
                        color={border.color}
                        weight={2}
                    />
                ))}

            </MapContainer>
        </div>
    )
}

export default Map
