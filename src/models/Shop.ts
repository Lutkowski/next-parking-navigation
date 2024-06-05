import {ITRKObject} from "@/models/TRKObject";
import mongoose, {model, Schema} from "mongoose";

export enum ShopCategory {
    Fashion = 'Одежда и аксессуары',
    Pharmacy = 'Аптеки',
    Food = 'Рестораны',
    Beauty = 'Красота',
}

export interface IShop extends ITRKObject {
    slug: string;
    category: ShopCategory,
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
    category: {
        type: String,
        enum: Object.values(ShopCategory)
    }
})

const Shop = mongoose.models?.Shop || model<IShop>('Shop', ShopSchema)
export default Shop