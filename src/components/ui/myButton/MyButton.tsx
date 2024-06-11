'use client'

import {MouseEventHandler, ReactNode} from "react";
import classes from "./mybutton.module.scss";
import {useRouter} from "next/navigation";
import {signOut} from "next-auth/react";

interface MyButtonProps {
    actionType?: 'Login' | 'Logout';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

const MyButton: React.FC<MyButtonProps> = ({actionType, children, onClick, type}) => {
    const router = useRouter();

    const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
        if (onClick) {
            onClick(event);
        } else {
            switch (actionType) {
                case "Login":
                    await router.push('/login');
                    break;
                case "Logout":
                    await signOut();
                    break;
                default:
                    break
            }
        }
    }

    return (
        <button className={classes.myButton} onClick={handleClick} type={type}>
            {children}
        </button>
    );
};

export default MyButton;