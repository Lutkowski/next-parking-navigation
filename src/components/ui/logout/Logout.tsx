'use client'
import {signOut} from "next-auth/react";

const Logout = () => {
    return (
        <span onClick={() => {
            signOut();
        }}>
            Выйти
        </span>
    );
};

export default Logout;