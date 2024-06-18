import {FacilityType} from "@/models/Facility";
import {Icon} from "leaflet";

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

export default customIcons