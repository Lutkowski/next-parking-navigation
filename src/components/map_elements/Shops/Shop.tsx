'use client'

import {LatLngExpression} from "leaflet";
import getShopColor from "@/lib/utils/getShopColor";
import {Polygon, Popup} from "react-leaflet";
import {IShop} from "@/models/Shop";
import {useEffect, useState} from "react";

interface ShopProps {
    shop: IShop;
    foundShop: string | null;
}


const Shop: React.FC<ShopProps> = ({shop, foundShop}) => {
    const [color, setColor] = useState(getShopColor(shop.category));

    useEffect(() => {
        setColor(foundShop === shop.slug ? 'red' : getShopColor(shop.category));
        const timer = setTimeout(() => {
            setColor(getShopColor(shop.category));
        }, 5000);
        return () => clearTimeout(timer);
    }, [foundShop, shop.slug, shop.category]);

    return (
        <Polygon
            key={shop._id}
            positions={shop.coordinates as LatLngExpression[]}
            pathOptions={{
                color: foundShop === shop._id ? 'red' : getShopColor(shop.category),
                weight: 3,
                fillColor: color,
            }}
            className='shops'
        >
            <Popup>{shop.slug}</Popup>
        </Polygon>
    );
};

export default Shop;