import Shop from "@/models/Shop";
import Border from "@/models/Border";
import Facility from "@/models/Facility";
import ParkingPlace from "@/models/ParkingPlace";
import Void from "@/models/Void";
import Placement from "@/models/Placement";
import {Model} from "mongoose";

const models: { [model: string]: Model<any> } = {
    borders: Border,
    facilities: Facility,
    parking: ParkingPlace,
    placements: Placement,
    voids: Void,
    shops: Shop,
};

export default models;