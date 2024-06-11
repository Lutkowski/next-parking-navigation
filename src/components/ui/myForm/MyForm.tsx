'use client'

import classes from "./myform.module.scss";
import {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import MyButton from "@/components/ui/myButton/MyButton";
import MyModal from "@/components/ui/myModal/MyModal";


interface MyFormProps {
    type: 'Регистрация' | 'Авторизация'
}

const MyForm: React.FC<MyFormProps> = ({type}) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.get("username"),
                    email: formData.get("email"),
                    password: formData.get("password"),
                }),
            });

            if (response.ok) {
                await signIn('credentials', {
                    email: formData.get("email"),
                    password: formData.get("password"),
                    redirect: false,
                });
                router.push("/");
                router.refresh();
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError('Внутренняя ошибка сервера');
        }
    };

    const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await signIn('credentials', {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (!response?.error) {
            router.push("/");
            router.refresh();
        } else {
            setError('Неверный email или пароль');
        }
    };

    const handleCloseModal = () => {
        setError(null);
    };

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
            {error && <MyModal message={error} onClose={handleCloseModal} />}
        </form>
    )
        ;
};

export default MyForm;