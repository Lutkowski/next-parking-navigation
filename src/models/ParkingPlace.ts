import mongoose, {model, Schema} from "mongoose";
import {ITRKObject} from "@/models/TRKObject";
import {IUser} from "@/models/User";

export interface IParkingPlace extends ITRKObject {
    user?: IUser | null;
    userEmail: string | null;
    bookingEnd?: Date | null;
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    userEmail: {
        type: String,
        default: null,
    },
    bookingEnd: {
        type: Date,
        default: null,
    },
})

const ParkingPlace = mongoose.models?.ParkingPlace || model<IParkingPlace>('ParkingPlace', parkingPlaceSchema);

export default ParkingPlace