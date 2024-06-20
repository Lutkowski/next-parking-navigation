import {IShop} from "@/models/Shop";
import Shop from "@/components/map_elements/Shops/Shop";
import Labels from "@/components/map_elements/Shops/Labels";

interface ShopsProps {
    shops: IShop[],
    foundShop: string | null;
}

const Shops: React.FC<ShopsProps> = ({shops, foundShop}) => {
    return (
        <>
            {shops.map((shop) => (
                <Shop key={shop._id} shop={shop} foundShop={foundShop}>
                </Shop>
            ))}
            <Labels shops={shops}></Labels>

        </>
    );
};

export default Shops;