import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import MyButton from '@/components/ui/myButton/MyButton';
import classes from './routemodal.module.scss';
import { IShop } from "@/models/Shop";

interface RouteModalProps {
    onClose: () => void;
    onBuildRoute: (startLocation: string, endLocation: string) => void;
    onClearRoute: () => void;
}

const RouteModal: React.FC<RouteModalProps> = ({ onClose, onBuildRoute, onClearRoute }) => {
    const [startLocation, setStartLocation] = useState<{ label: string, value: string } | null>(null);
    const [endLocation, setEndLocation] = useState<{ label: string, value: string } | null>(null);

    // Функция для загрузки названий магазинов из API с использованием fetch
    const loadShopOptions = async (inputValue: string) => {
        try {
            const response = await fetch(`/api/shops`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching shops: ${response.statusText}`);
            }

            const data = await response.json();

            // Преобразование данных в формат, необходимый для react-select
            const shopOptions = data.map((shop: IShop) => ({
                label: shop.slug, // Отображаемое имя (slug)
                value: shop.slug   // ID магазина
            }));

            // Добавляем опцию "Мое парковочное место"
            const parkingOption = { label: 'Мое парковочное место', value: 'Мое парковочное место' };

            // Фильтрация по введенному значению
            const filteredOptions = [parkingOption, ...shopOptions].filter(option =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            return filteredOptions;
        } catch (error) {
            console.error('Error fetching shop options:', error);
            return [];
        }
    };

    const handleBuildClick = () => {
        if (startLocation && endLocation) {
            onBuildRoute(startLocation.value, endLocation.value); // Передаем значения в виде строк
        }
    };

    const handleClearClick = () => {
        setStartLocation(null);
        setEndLocation(null);
        onClearRoute();
        onClose();
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    <h2>Построение маршрута</h2>
                    <AsyncSelect
                        cacheOptions
                        loadOptions={loadShopOptions}  // Передаем нашу функцию загрузки опций
                        defaultOptions={true}
                        isSearchable={true}
                        placeholder="Начальный магазин"
                        value={startLocation}
                        onChange={(option) => setStartLocation(option)}
                        className={classes.select}
                    />
                    <AsyncSelect
                        cacheOptions
                        loadOptions={loadShopOptions}  // Передаем нашу функцию загрузки опций
                        defaultOptions={true}
                        isSearchable={true}
                        placeholder="Конечный магазин"
                        value={endLocation}
                        onChange={(option) => setEndLocation(option)}
                        className={classes.select}
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
