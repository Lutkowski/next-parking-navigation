'use client'

import 'leaflet/dist/leaflet.css'
import {MapContainer, Marker, Polygon, Polyline, Popup, TileLayer} from 'react-leaflet';
import {Icon, LatLngExpression} from "leaflet";
import {FacilityType} from "@/models/Facility";
import {useMapData} from "@/hooks/useMapData";
import Zoom from "@/components/ui/zoom/Zoom";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import {useEffect, useState} from "react";
import Search from "@/components/ui/search/Search";
import {ShopCategory} from "@/models/Shop";
import Filter from "@/components/ui/filter/Filter";
import classes from "./map.module.scss";
import {IParkingPlace} from "@/models/ParkingPlace";
import {getSession} from "next-auth/react";
import BookingModal from "@/components/ui/BookingModal/BookingModal";
import MyModal from "@/components/ui/myModal/MyModal";

const Map = () => {

    const initialPosition: [number, number] = [56.306470, 44.075805];
    const [foundShop, setFoundShop] = useState<string | null>(null)
    const {parkingPlaces, shops, voids, placements, borders, facilities} = useMapData();
    const [filter, setFilter] = useState<string | null>(null)
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [places, setPlaces] = useState(parkingPlaces);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);


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
                    // Наше забронированное место
                    setSelectedPlace(place);
                    setShowModal(true);
                } else {
                    // Забронированное место другого пользователя
                    setModalMessage('Данное место уже забронировано.');
                }
                return;
            }
        }

        // Свободное место
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


    const filteredShops = filter ? shops.filter(shop => shop.category === filter) : shops;


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
        </>
    )
}

export default Map
