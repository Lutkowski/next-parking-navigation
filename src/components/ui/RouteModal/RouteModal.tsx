// RouteModal.tsx
import React, {useState} from 'react';
import classes from './routemodal.module.scss';
import MyButton from "@/components/ui/myButton/MyButton";

interface RouteModalProps {
    onClose: () => void;
    onBuildRoute: (startShop: string, endShop: string) => void;
}

const RouteModal: React.FC<RouteModalProps> = ({onClose, onBuildRoute}) => {
    const [startShop, setStartShop] = useState('');
    const [endShop, setEndShop] = useState('');

    const handleBuildRoute = () => {
        onBuildRoute(startShop, endShop);
    }

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    <input
                        type="text"
                        placeholder="Магазин отправления"
                        value={startShop}
                        onChange={(e) => setStartShop(e.target.value)}
                        className={classes.input}
                    />
                    <input
                        type="text"
                        placeholder="Магазин назначения"
                        value={endShop}
                        onChange={(e) => setEndShop(e.target.value)}
                        className={classes.input}
                    />
                    <MyButton onClick={handleBuildRoute}>Построить</MyButton>
                    <MyButton onClick={onClose}>Закрыть</MyButton>
                </div>
            </div>
        </div>
    );
};

export default RouteModal;
