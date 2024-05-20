import {model, Schema} from "mongoose";
import {ITRKObject} from "@/models/TRKObject";

export interface IParkingPlace extends ITRKObject {

}

const parkingPlaceSchema: Schema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    coordinates: {
        type: [[Number]],
        required: true,
    },
    floor: {
        type: Number,
        required: true,
    },
})

const ParkingPlace = model<IParkingPlace>('ParkingPlace', parkingPlaceSchema);

export default ParkingPlace