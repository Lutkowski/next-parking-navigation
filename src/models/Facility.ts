import {ITRKObject} from "@/models/TRKObject";
import {model, Schema} from "mongoose";

export enum FacilityType {
    Elevator = 'Лифт',
    EscalatorUp = 'Эскалатор вверх',
    EscalatorDown = 'Эскалатор вниз',
    Entrance = 'Вход'
}

export interface IFacility extends Omit<ITRKObject, 'coordinates'> {
    coordinate: [number, number];
    slug?: string;
    type: FacilityType;
}

const facilitySchema: Schema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    floor: {
        type: Number,
        required: true,
    },
    coordinate: {
        type: [Number],
        required: true,
    },
    slug: {
        type: String,
    },
    type: {
        type: String,
        enum: Object.values(FacilityType),
        required: true,
    },
})

const Facility = model<IFacility>('Facility', facilitySchema)

export default Facility