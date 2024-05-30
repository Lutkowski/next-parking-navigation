import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import Placement from "@/models/Placement";

export async function GET(req: NextRequest) {
    await dbConnect();
    const params = req.nextUrl.searchParams;
    const floor = params.get('floor');
    const filter = floor ? { floor: Number(floor) } : {};
    const placements = await Placement.find(filter);
    return NextResponse.json(placements);
}