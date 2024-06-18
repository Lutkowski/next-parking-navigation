import {Polyline} from "react-leaflet";
import {LatLngExpression} from "leaflet";
import {IBorder} from "@/models/Border";

interface BordersProps {
    borders: IBorder[],
}

const Borders: React.FC<BordersProps> = ({borders}) => {
    return (
        <>
            {borders.map((border) => (
                <Polyline
                    key={border._id}
                    positions={border.coordinates as LatLngExpression[]}
                    color={border.color}
                    weight={2}
                />
            ))}
        </>
    );
};

export default Borders;