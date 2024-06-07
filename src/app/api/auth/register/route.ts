import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "@/lib/dbConnect";
import * as bcrypt from "bcrypt"
import User from "@/models/User";


export async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    const {username, email, password} = req.body;

    try {
        await dbConnect()

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: 'Пользователь с такой почтой уже зарегистрирован'})
        }

        const hashedPassword = bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

        const newUser = new User({username, email, hashedPassword})
        await newUser.save()
        res.status(201).json({message: 'Вы успешно зарегистрированы'})
    } catch (e) {
        res.status(500).json({message: 'Внутренняя ошибка сервера'})
    }
}