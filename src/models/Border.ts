import {ITRKObject} from "@/models/TRKObject";
import {model, Schema} from "mongoose";

export interface IBorder extends ITRKObject {
    color: string;
}

const BorderSchema: Schema = new Schema({
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
    color: {
        type: String,
        required: true,
    },
})

const Border = model<IBorder>('Border', BorderSchema)
export default Border