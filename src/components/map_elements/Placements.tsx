import {Polygon} from "react-leaflet";
import {LatLngExpression} from "leaflet";
import {IPlacement} from "@/models/Placement";

interface PlacementsProps {
    placements: IPlacement[],
}

const Placements: React.FC<PlacementsProps> = ({placements}) => {
    return (
        <>
            {placements.map((path) => (
                <Polygon
                    key={path._id}
                    positions={path.coordinates as LatLngExpression[]}
                    color='rgba(127, 127, 127, 1)'
                />
            ))}
        </>
    );
};

export default Placements;