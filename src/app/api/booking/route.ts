import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ParkingPlace from '@/models/ParkingPlace';
import User from '@/models/User';
import {getToken} from "next-auth/jwt";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { parkingPlaceId, bookingEnd } = await req.json();

        const token = await getToken({req})
        if (!token || !token.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = token.email;
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.bookedPlace && user.bookingEnd && new Date(user.bookingEnd) > new Date()) {
            return NextResponse.json({ message: 'User already has an active booking' }, { status: 403 });
        }

        const parkingPlace = await ParkingPlace.findById(parkingPlaceId);
        if (!parkingPlace) {
            return NextResponse.json({ message: 'Parking place not found' }, { status: 404 });
        }


        user.bookedPlace = parkingPlace._id;
        user.bookingEnd = new Date(bookingEnd);

        parkingPlace.user = user._id;
        parkingPlace.bookingEnd = new Date(bookingEnd);

        await user.save();
        await parkingPlace.save();

        return NextResponse.json({ message: 'Place successfully booked', parkingPlace }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
