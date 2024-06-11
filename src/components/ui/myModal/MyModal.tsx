import React from 'react';
import classes from './mymodal.module.scss';
import MyButton from "@/components/ui/myButton/MyButton";

interface ModalProps {
    message: string;
    onClose: () => void;
}

const MyModal: React.FC<ModalProps> = ({ message, onClose }) => {
    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    <p>{message}</p>
                    <MyButton onClick={onClose}>Закрыть</MyButton>
                </div>
            </div>
        </div>
    );
};

export default MyModal;
