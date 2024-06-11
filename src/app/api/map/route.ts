import type {NextRequest} from 'next/server'

import dbConnect from "@/lib/dbConnect";
import {NextResponse} from "next/server";
import models from "@/models";

export async function GET(req: NextRequest) {
    await dbConnect()
    const params = req.nextUrl.searchParams
    const floor = params.get("floor")
    const type = params.get("type")

    if (!type || !models[type]) {
        return NextResponse.json({message: 'Invalid objects parameter'}, {status: 400})
    }

    const filter = floor ? {floor: Number(floor)} : {}
    const objects = await models[type].find(filter)
    return NextResponse.json(objects);
}
