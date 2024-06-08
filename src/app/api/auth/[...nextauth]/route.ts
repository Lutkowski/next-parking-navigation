import NextAuth from 'next-auth';

import * as bcrypt from "bcrypt"
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: 'Email', type: 'text'},
                password: {label: 'Password', type: 'password'},
            },
            authorize: async (credentials: any) => {
                await dbConnect()

                const user = await User.findOne({email: credentials.email});

                if (user && bcrypt.compareSync(credentials!.password, user.password)) {
                    return {
                        id: user._id,
                        name: user.username,
                        email: user.email,
                    };
                }

                return null;
            },
        })
    ],
})

