'use client'

import 'leaflet/dist/leaflet.css'
import {MapContainer, Marker, Polygon, Polyline, Popup, TileLayer} from 'react-leaflet';
import {Icon, LatLngExpression} from "leaflet";
import {FacilityType} from "@/models/Facility";
import {useMapData} from "@/hooks/useMapData";
import Zoom from "@/components/ui/zoom/Zoom";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import {useState} from "react";
import Search from "@/components/ui/search/Search";
import {ShopCategory} from "@/models/Shop";
import Filter from "@/components/ui/filter/Filter";

const Map = () => {

    const initialPosition: [number, number] = [56.306470, 44.075805];
    const [foundShop, setFoundShop] = useState<string | null>(null)
    const {parkingPlaces, shops, voids, placements, borders, facilities} = useMapData();
    const [filter, setFilter] = useState<string | null>(null)

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

    const getColorByCategory = (category: ShopCategory) => {
        switch (category) {
            case ShopCategory.Beauty:
                return 'rgba(255, 192, 203, 0.5)';
            case ShopCategory.Fashion:
                return 'rgba(0, 0, 255, 0.5)';
            case ShopCategory.Food:
                return 'rgba(255, 165, 0, 0.5)';
            case ShopCategory.Pharmacy:
                return 'rgba(0, 128, 0, 0.5)';
            default:
                return 'rgba(255, 165, 0, 0.5)'
        }
    }

    const filteredShops = filter ? shops.filter(shop => shop.category === filter) : shops;

    return (
        <div>
            <MapContainer
                center={initialPosition}
                minZoom={18}
                zoom={18}
                zoomControl={false}
                style={{height: '100vh', width: '100%'}}
            >
                <Search setFoundShop={setFoundShop}/>
                <Filter setFilter={setFilter}/>
                <Sidebar/>
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

                {filteredShops.map((shop) => (
                    <Polygon
                        key={shop._id}
                        positions={shop.coordinates as LatLngExpression[]}
                        pathOptions={{
                            color: foundShop === shop._id ? 'red' : getColorByCategory(shop.category),
                            weight: 3,
                            fillColor: getColorByCategory(shop.category),
                        }}
                        className='shops'
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
