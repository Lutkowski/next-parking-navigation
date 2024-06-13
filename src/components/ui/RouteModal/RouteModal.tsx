import React, { useState } from 'react';
import MyButton from '@/components/ui/myButton/MyButton';
import classes from './routeModal.module.scss';

interface RouteModalProps {
    onClose: () => void;
    onBuildRoute: (startShopName: string, endShopName: string) => void;
    onClearRoute: () => void; // Добавляем новый пропс для очистки маршрута
}

const RouteModal: React.FC<RouteModalProps> = ({ onClose, onBuildRoute, onClearRoute }) => {
    const [startShopName, setStartShopName] = useState('');
    const [endShopName, setEndShopName] = useState('');

    const handleBuildClick = () => {
        onBuildRoute(startShopName, endShopName);
    };

    const handleClearClick = () => {
        onClearRoute();
        onClose();
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    <h2>Построение маршрута</h2>
                    <input
                        type="text"
                        placeholder="Начальный магазин"
                        value={startShopName}
                        onChange={(e) => setStartShopName(e.target.value)}
                        className={classes.input}
                    />
                    <input
                        type="text"
                        placeholder="Конечный магазин"
                        value={endShopName}
                        onChange={(e) => setEndShopName(e.target.value)}
                        className={classes.input}
                    />
                    <div className={classes.buttonGroup}>
                        <MyButton onClick={handleBuildClick}>Построить</MyButton>
                        <MyButton onClick={handleClearClick}>Очистить</MyButton>
                    </div>
                    <MyButton onClick={onClose}>Закрыть</MyButton>
                </div>
            </div>
        </div>
    );
};

export default RouteModal;
