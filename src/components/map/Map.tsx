'use client'

import React, {useEffect, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import {MapContainer, Marker, Pane, Polygon, Polyline, Popup, TileLayer} from 'react-leaflet';
import {Icon, LatLngExpression} from 'leaflet';
import {FacilityType} from '@/models/Facility';
import {useMapData} from '@/hooks/useMapData';
import Zoom from '@/components/ui/zoom/Zoom';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import Search from '@/components/ui/search/Search';
import {ShopCategory} from '@/models/Shop';
import Filter from '@/components/ui/filter/Filter';
import classes from './map.module.scss';
import {IParkingPlace} from '@/models/ParkingPlace';
import {getSession} from 'next-auth/react';
import BookingModal from '@/components/ui/BookingModal/BookingModal';
import MyModal from '@/components/ui/myModal/MyModal';
import RouteModal from '@/components/ui/RouteModal/RouteModal';
import Image from 'next/image';
import {useFloor} from "@/contexts/FloorContext"; // Импортируем контекст этажа

const Map = () => {
    const initialPosition: [number, number] = [56.306470, 44.075805];
    const [foundShop, setFoundShop] = useState<string | null>(null);
    const {parkingPlaces, shops, voids, placements, borders, facilities} = useMapData();
    const [filter, setFilter] = useState<string | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [places, setPlaces] = useState(parkingPlaces);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [route, setRoute] = useState<LatLngExpression[]>([]);
    const [routeFloor, setRouteFloor] = useState<number | null>(null); // Добавляем состояние для этажа маршрута

    const {currentFloor} = useFloor(); // Используем контекст этажа

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            setUserEmail(session?.user?.email || null);
        };

        fetchSession();
        setPlaces(parkingPlaces);
    }, [parkingPlaces]);

    const customIcons: { [key in FacilityType]: Icon } = {
        [FacilityType.Elevator]: new Icon({
            iconUrl: '/elevator.svg',
            iconSize: [30, 30],
            iconAnchor: [12, 12],
        }),
        [FacilityType.EscalatorUp]: new Icon({
            iconUrl: '/escalator_up.svg',
            iconSize: [30, 30],
            iconAnchor: [12, 12],
        }),
        [FacilityType.EscalatorDown]: new Icon({
            iconUrl: '/escalator_down.svg',
            iconSize: [30, 30],
            iconAnchor: [12, 12],
        }),
        [FacilityType.Entrance]: new Icon({
            iconUrl: '/entrance.svg',
            iconSize: [30, 30],
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
                return 'rgba(255, 165, 0, 0.5)';
        }
    };

    const getColorByStatus = (place: IParkingPlace) => {
        if (place.bookingEnd) {
            const now = new Date();
            const bookingEnd = new Date(place.bookingEnd);

            if (now <= bookingEnd) {
                return place.userEmail === userEmail ? 'yellow' : 'red';
            }
        }
        return 'green';
    };

    const handlePlaceClick = async (place: IParkingPlace) => {
        const session = await getSession();
        if (!session || !session.user) {
            setModalMessage('Для бронирования парковочного места войдите в систему.');
            return;
        }

        if (place.bookingEnd) {
            const now = new Date();
            const bookingEnd = new Date(place.bookingEnd);

            if (now <= bookingEnd) {
                if (place.userEmail === userEmail) {
                    setSelectedPlace(place);
                    setShowModal(true);
                } else {
                    setModalMessage('Данное место уже забронировано.');
                }
                return;
            }
        }

        setSelectedPlace(place);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPlace(null);
        setModalMessage(null);
    };

    const handleBooking = async (bookingEnd: string) => {
        if (!selectedPlace) {
            setModalMessage('Выберите место для бронирования.');
            return;
        }

        const session = await getSession();
        if (!session || !session.user) {
            setModalMessage('Вы должны быть авторизованы для бронирования места.');
            return;
        }

        const response = await fetch('/api/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parkingPlaceId: selectedPlace._id,
                bookingEnd,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setPlaces((prevPlaces) =>
                prevPlaces.map((place) => (place._id === data.parkingPlace._id ? data.parkingPlace : place))
            );
            setShowModal(false);
            setModalMessage('Место успешно забронировано!');
        } else {
            const data = await response.json();
            setModalMessage(`Ошибка бронирования: ${data.message}`);
        }
    };

    const handleCancelBooking = async () => {
        if (!selectedPlace) {
            setModalMessage('Выберите место для отмены бронирования.');
            return;
        }

        const response = await fetch('/api/booking', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parkingPlaceId: selectedPlace._id,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setPlaces((prevPlaces) =>
                prevPlaces.map((place) => (place._id === data.parkingPlace._id ? data.parkingPlace : place))
            );
            setShowModal(false);
            setModalMessage('Бронирование успешно отменено!');
        } else {
            const data = await response.json();
            setModalMessage(`Ошибка отмены бронирования: ${data.message}`);
        }
    };

    const getCenter = (coordinates: [number, number][]) => {
        const lat = coordinates.reduce((acc, coord) => acc + coord[0], 0) / coordinates.length;
        const lng = coordinates.reduce((acc, coord) => acc + coord[1], 0) / coordinates.length;
        return [lat, lng] as LatLngExpression;
    };

    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const wrapText = (text: string, maxLineLength: number) => {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            if (currentLine.length + word.length <= maxLineLength) {
                currentLine += word + ' ';
            } else {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            }
        });

        lines.push(currentLine.trim());
        return lines;
    };

    const calculatePolygonArea = (coordinates: [number, number][]) => {
        let area = 0;
        const numPoints = coordinates.length;

        for (let i = 0; i < numPoints; i++) {
            const [x1, y1] = coordinates[i];
            const [x2, y2] = coordinates[(i + 1) % numPoints];
            area += x1 * y2 - x2 * y1;
        }

        return Math.abs(area / 2);
    };

    const filteredShops = filter ? shops.filter(shop => shop.category === filter) : shops;

    const handleOpenRouteModal = () => {
        setShowRouteModal(true);
    };

    const handleRouteModalClose = () => {
        setShowRouteModal(false);
    };

    const handleBuildRoute = async (startShopName: string, endShopName: string) => {
        const response = await fetch(`/api/route?startShopName=${encodeURIComponent(startShopName)}&endShopName=${encodeURIComponent(endShopName)}`);
        if (response.ok) {
            const data = await response.json();
            setRoute(data.coordinates);
            setRouteFloor(data.floor); // Установим этаж для маршрута
        }
        setShowRouteModal(false);
    };

    const clearRoute = () => {
        setRoute([]);
        setRouteFloor(null);
    };

    useEffect(() => {
        if (route.length > 0) {
            console.log('Route coordinates:', route);
        }
    }, [route]);

    return (
        <>
            <MapContainer
                center={initialPosition}
                minZoom={18}
                zoom={18}
                zoomControl={false}
                className={classes.map}
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

                {places.map((place) => (
                    <Polygon
                        key={place._id}
                        positions={place.coordinates as LatLngExpression[]}
                        color={getColorByStatus(place)}
                        className='cars'
                        eventHandlers={{
                            click: () => handlePlaceClick(place),
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

                <Pane name="labels" style={{zIndex: 500}}>
                    {filteredShops.map((shop) => {
                        const area = calculatePolygonArea(shop.coordinates);
                        if (area < 9.697623681859113e-8) return null;

                        const escapedSlug = escapeHtml(shop.slug);
                        const lines = wrapText(escapedSlug, 10);
                        const svgText = lines.map((line, index) => `<tspan x="50%" dy="${index === 0 ? 0 : 15}">${line}</tspan>`).join('');

                        return (
                            <Marker
                                key={shop._id}
                                position={getCenter(shop.coordinates)}
                                icon={new Icon({
                                    iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" width="100" height="50">
                            <rect  width="100" height="50" fill="rgba(255, 255, 255, 0.0)" rx="5" ry="5"/>
                            <text  font-weight="700" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="black">${svgText}</text>
                        </svg>
                    `),
                                    iconSize: [100, 50],
                                    iconAnchor: [50, 25],
                                    className: classes.shopLabel
                                })}
                            />
                        );
                    })}
                </Pane>

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

                {route.length > 0 && routeFloor === currentFloor && <Polyline positions={route} color="red"/>}
            </MapContainer>

            <div className={classes.routeButtonContainer}>
                <button className={classes.routeButton} onClick={handleOpenRouteModal}>
                    <Image src="/route.svg" alt="Маршрут" width={30} height={30}/>
                </button>
            </div>

            {showModal && selectedPlace && (
                <BookingModal
                    place={selectedPlace}
                    onClose={handleModalClose}
                    onBook={handleBooking}
                    onCancel={handleCancelBooking}
                    userEmail={userEmail}
                />
            )}

            {modalMessage && <MyModal message={modalMessage} onClose={handleModalClose}/>}

            {showRouteModal && (
                <RouteModal onClose={handleRouteModalClose} onBuildRoute={handleBuildRoute} onClearRoute={clearRoute}/>
            )}
        </>
    );
};

export default Map;
