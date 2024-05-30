import {ITRKObject} from "@/models/TRKObject";
import {model, Schema} from "mongoose";

export interface IVoid extends ITRKObject {
}

const VoidSchema: Schema = new Schema({
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

const Void = model<IVoid>('Void', VoidSchema)
export default Void