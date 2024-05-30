import {ITRKObject} from "@/models/TRKObject";
import {model, Schema} from "mongoose";

export interface IPlacement extends ITRKObject {
}

const PlacementSchema: Schema = new Schema({
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
    }
})

const Placement = model<IPlacement>('Placement', PlacementSchema)
export default Placement