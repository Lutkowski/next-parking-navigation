import {ITRKObject} from "@/models/TRKObject";
import {model, Schema} from "mongoose";

export interface IShop extends ITRKObject {
    slug: string;
}

const ShopSchema: Schema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    slug: {
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

const Shop = model<IShop>('Shop', ShopSchema)
export default Shop