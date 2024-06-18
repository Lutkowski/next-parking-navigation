import React from 'react';
import {Polygon} from "react-leaflet";
import {LatLngExpression} from "leaflet";
import getParkingColor from "@/lib/utils/getParkingColor";
import {IParkingPlace} from "@/models/ParkingPlace";

interface ParkingPlacesProps {
    places: IParkingPlace[],
    userEmail: string | null,
    onPlaceClick: (place: IParkingPlace) => void,
}

const ParkingPlaces: React.FC<ParkingPlacesProps> = ({places, userEmail, onPlaceClick}) => {
    return (
        <>
            {places.map((place) => (
                <Polygon
                    key={place._id}
                    positions={place.coordinates as LatLngExpression[]}
                    color={getParkingColor(place, userEmail)}
                    className='cars'
                    eventHandlers={{
                        click: () => onPlaceClick(place),
                    }}
                />
            ))}
        </>
    );
};

export default ParkingPlaces;