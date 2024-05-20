import type {NextRequest} from 'next/server'

import dbConnect from "@/lib/dbConnect";
import ParkingPlace from "@/models/ParkingPlace";
import {NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect()
    const params = req.nextUrl.searchParams
    const floor = params.get("floor")
    const filter = floor ? {floor: Number(floor)} : {}
    const parkingPlaces = await ParkingPlace.find(filter)
    return NextResponse.json(parkingPlaces);
}
