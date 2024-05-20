import type {NextRequest} from 'next/server'

import dbConnect from "@/lib/dbConnect";
import {NextResponse} from "next/server";
import Shop from "@/models/Shop";

export async function GET(req: NextRequest) {
    await dbConnect()
    const params = req.nextUrl.searchParams
    const floor = params.get("floor")
    const filter = floor ? {floor: Number(floor)} : {}
    const shops = await Shop.find(filter)
    return NextResponse.json(shops);
}
