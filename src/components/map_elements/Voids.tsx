import {Polygon} from "react-leaflet";
import {LatLngExpression} from "leaflet";
import {IVoid} from "@/models/Void";

interface VoidsProps {
    voids: IVoid[]
}

const Voids: React.FC<VoidsProps> = ({voids}) => {
    return (
        <>
            {voids.map((path) => (
                <Polygon
                    key={path._id}
                    positions={path.coordinates as LatLngExpression[]}
                    color='rgba(127, 127, 127, 0.4)'
                />
            ))}
        </>
    );
};

export default Voids;