'use client'

import classes from "./myform.module.scss";
import {FormEvent} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import MyButton from "@/components/ui/myButton/MyButton";


interface MyFormProps {
    type: 'Регистрация' | 'Авторизация'
}

const MyForm: React.FC<MyFormProps> = ({type}) => {
    const router = useRouter();
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


        if (response.status == 201) {
            await signIn('credentials', {
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false,
            })
            router.push("/");
            router.refresh();
        }
    }

    const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await signIn('credentials', {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        })

        if (!response?.error) {
            router.push("/");
            router.refresh();
        }
    }

    return (
        <form className={classes.form} onSubmit={type === 'Регистрация' ? handleRegisterSubmit : handleLoginSubmit}>
                {type === 'Регистрация' && (<input name="username" type="text" placeholder="Ник"/>)}
                <input name="email" type="email" placeholder="Почта"/>
                <input name="password" type="password" placeholder="Пароль"/>
                <MyButton type="submit">{type}</MyButton>
                {type === 'Авторизация' && (
                    <p>
                        Еще не зарегистрированы? <Link href="/register">Регистрация</Link>
                    </p>
                )}
        </form>
    )
        ;
};

export default MyForm;