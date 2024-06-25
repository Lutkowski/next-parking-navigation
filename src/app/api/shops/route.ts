import type {NextRequest} from 'next/server'
import dbConnect from "@/lib/utils/dbConnect";
import {NextResponse} from "next/server";
import Shop from "@/models/Shop";

export async function GET(req: NextRequest) {
    await dbConnect()

    const shopsList = await Shop.find({}, 'slug');

    if (!shopsList) {
        return NextResponse.json({message: 'Магазины не найден'}, {status: 404});
    }

    return NextResponse.json(shopsList);
}
