import dbConnect from "@/lib/utils/dbConnect";
import Shop from "@/models/Shop";

const findShopByName = async (name: string) => {
    await dbConnect();
    const shop = await Shop.findOne({ slug: name });
    return shop;
};

export default findShopByName