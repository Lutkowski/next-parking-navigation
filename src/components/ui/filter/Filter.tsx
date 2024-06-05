import {ShopCategory} from '@/models/Shop';
import classes from "./filter.module.scss";

interface FilterProps {
    setFilter: (filter: ShopCategory | null) => void;
}

const Filter: React.FC<FilterProps> = ({setFilter}) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as ShopCategory | null | 'Нет фильтра';
        setFilter(value === 'Нет фильтра' ? null : value);
    };

    return (
        <div className={classes.filter}>
            <select className={classes.filterSelect} onChange={handleChange} defaultValue="all">
                <option value="Нет фильтра">Нет фильтра</option>
                <option value={ShopCategory.Fashion}>Одежда и аксессуары</option>
                <option value={ShopCategory.Pharmacy}>Аптеки</option>
                <option value={ShopCategory.Food}>Рестораны</option>
                <option value={ShopCategory.Beauty}>Красота</option>
            </select>
        </div>
    );
};

export default Filter;
