import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import Void from "@/models/Void";

export async function GET(req: NextRequest) {
    await dbConnect();
    const params = req.nextUrl.searchParams;
    const floor = params.get('floor');
    const filter = floor ? { floor: Number(floor) } : {};
    const voids = await Void.find(filter);
    return NextResponse.json(voids);
}
