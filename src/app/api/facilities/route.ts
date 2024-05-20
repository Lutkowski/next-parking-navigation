import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Facility from '@/models/Facility';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await dbConnect();
    const params = req.nextUrl.searchParams;
    const floor = params.get('floor');
    const filter = floor ? { floor: Number(floor) } : {};
    const facilities = await Facility.find(filter);
    return NextResponse.json(facilities);
}
