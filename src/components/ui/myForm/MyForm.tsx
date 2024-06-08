'use client'

import classes from "./myform.module.scss";
import {FormEvent} from "react";
import {signIn} from "next-auth/react";


interface MyFormProps {
    type: 'Регистрация' | 'Авторизация'
}

const MyForm: React.FC<MyFormProps> = ({type}) => {
    const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await fetch('api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password"),
            })
        })
    }

    const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await signIn('credentials', {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        })
    }

    return (
        <form className={classes.form} onSubmit={type === 'Регистрация' ? handleRegisterSubmit : handleLoginSubmit}>
            {type === 'Регистрация' && (<input name="username" type="text" placeholder="Ник"/>)}
            <input name="email" type="email" placeholder="Почта"/>
            <input name="password" type="password" placeholder="Пароль"/>
            <button type="submit">{type}</button>
        </form>
    );
};

export default MyForm;