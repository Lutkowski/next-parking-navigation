'use client'

import 'leaflet/dist/leaflet.css'
import {MapContainer, TileLayer, Polygon, Marker, Popup, Polyline} from 'react-leaflet';
import {useEffect, useState} from "react";
import {IParkingPlace} from "@/models/ParkingPlace";
import {LatLngExpression} from "leaflet";
import {useFloor} from "@/contexts/FloorContext";
import {IShop} from "@/models/Shop";
import {Icon} from 'leaflet'
import {FacilityType, IFacility} from "@/models/Facility";
import {IBorder} from "@/models/Border";
import {IVoid} from "@/models/Void";
import {IPlacement} from "@/models/Placement";


const Map = () => {

    const initialPosition: [number, number] = [56.306470, 44.075805];
    const [parkingPlaces, setParkingPlaces] = useState<IParkingPlace[]>([]);
    const [shops, setShops] = useState<IShop[]>([]);
    const [voids, setVoids] = useState<IVoid[]>([]);
    const [placements, setPlacements] = useState<IPlacement[]>([]);
    const [borders, setBorders] = useState<IBorder[]>([]);
    const [facilities, setFacilities] = useState<IFacility[]>([]);
    const {currentFloor, setCurrentFloor} = useFloor()

    useEffect(() => {
        fetch(`/api/map?floor=${currentFloor}&type=parking`)
            .then((response) => response.json())
            .then((data) => setParkingPlaces(data))
            .catch((error) => console.error('Error fetching parking data:', error));
    }, [currentFloor]);

    useEffect(() => {
        fetch(`/api/map?floor=${currentFloor}&type=voids`)
            .then((response) => response.json())
            .then((data) => setVoids(data))
            .catch((error) => console.error('Error fetching void data:', error));
    }, [currentFloor]);

    useEffect(() => {
        fetch(`/api/map?floor=${currentFloor}&type=placements`)
            .then((response) => response.json())
            .then((data) => setPlacements(data))
            .catch((error) => console.error('Error fetching placement data:', error));
    }, [currentFloor]);

    useEffect(() => {
        fetch(`/api/map?floor=${currentFloor}&type=shops`)
            .then((response) => response.json())
            .then((data) => setShops(data))
            .catch((error) => console.error('Error fetching shop data:', error));
    }, [currentFloor]);

    useEffect(() => {
        fetch(`/api/map?floor=${currentFloor}&type=borders`)
            .then((response) => response.json())
            .then((data) => setBorders(data))
            .catch((error) => console.error('Error fetching border data:', error));
    }, [currentFloor]);

    useEffect(() => {
        fetch(`/api/map?floor=${currentFloor}&type=facilities`)
            .then((response) => response.json())
            .then((data) => setFacilities(data))
            .catch((error) => console.error('Error fetching facilities data:', error));
    }, [currentFloor]);

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
            <MapContainer center={initialPosition} minZoom={18} zoom={18} style={{height: '100vh', width: '100%'}}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a> contributors'
                    maxNativeZoom={19}
                    maxZoom={21}
                />

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
