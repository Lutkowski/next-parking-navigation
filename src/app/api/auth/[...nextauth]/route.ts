import NextAuth from 'next-auth';

import * as bcrypt from "bcrypt"
import User from "@/models/User";
import dbConnect from "@/lib/utils/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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
            authorize: async (credentials: any, req) => {
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
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.user = token
            return session
        },

    }
})

export {handler as GET, handler as POST}