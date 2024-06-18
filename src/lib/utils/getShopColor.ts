import {ShopCategory} from "@/models/Shop";

const getShopColor = (category: ShopCategory) => {
    switch (category) {
        case ShopCategory.Beauty:
            return 'rgba(255, 192, 203, 0.5)';
        case ShopCategory.Fashion:
            return 'rgba(0, 0, 255, 0.5)';
        case ShopCategory.Food:
            return 'rgba(255, 165, 0, 0.5)';
        case ShopCategory.Pharmacy:
            return 'rgba(0, 128, 0, 0.5)';
        default:
            return 'rgba(255, 165, 0, 0.5)';
    }
};

export default getShopColor