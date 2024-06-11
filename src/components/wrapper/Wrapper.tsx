import classes from "./wrapper.module.scss";
import {ReactNode} from "react";

interface WrapperProps {
    children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({children}) => {
    return <div className={classes.wrapper}>{children}</div>;
};
export default Wrapper;