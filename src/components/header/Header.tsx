import classes from "./header.module.scss";
import {getServerSession} from "next-auth";
import MyButton from "@/components/ui/myButton/MyButton";


const Header: React.FC = async () => {
    const session = await getServerSession()
    return (
        <header className={classes.header}>
            <nav className={classes.headerNavigation}>
                {session ? <MyButton actionType="Logout">Выйти</MyButton> :
                    <MyButton actionType="Login">Войти</MyButton>}
            </nav>
        </header>
    );
};

export default Header;