import dbConnect from "@/lib/utils/dbConnect";
import * as bcrypt from "bcrypt"
import User from "@/models/User";
import {NextRequest, NextResponse} from "next/server";


export async function POST(req: NextRequest) {

    const {username, email, password} = await req.json();

    try {
        await dbConnect()

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return NextResponse.json({message: 'Пользователь с таким email уже зарегистрирован'}, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

        const newUser = new User({username, email, password:hashedPassword})
        await newUser.save()
        return NextResponse.json({message:'Пользователь успешно зарегистрирован'}, {status: 201})
    } catch (e) {
        return NextResponse.json({message: 'Внутренняя ошибка сервера'}, {status: 500})
    }
}