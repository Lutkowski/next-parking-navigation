import {Marker, Popup} from "react-leaflet";
import customIcons from "@/lib/constants/icons";
import {LatLngExpression} from "leaflet";
import {IFacility} from "@/models/Facility";

interface FacilitiesProps {
    facilities: IFacility[],
}

const Facilities: React.FC<FacilitiesProps> = ({facilities}) => {
    return (
        <>
            {facilities.map((facility) => (
                <Marker
                    key={facility._id}
                    icon={customIcons[facility.type]}
                    position={facility.coordinate as LatLngExpression}
                >
                    <Popup>{facility.type}</Popup>
                </Marker>
            ))}
        </>
    );
};

export default Facilities;