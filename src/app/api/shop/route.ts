import type {NextRequest} from 'next/server'
import dbConnect from "@/lib/dbConnect";
import {NextResponse} from "next/server";
import Shop from "@/models/Shop";

export async function GET(req: NextRequest) {
    await dbConnect()
    const params = req.nextUrl.searchParams
    const slug = params.get("slug")

    if (!slug) {
        return NextResponse.json({message: 'Нет параметра slug'}, {status: 400})
    }

    const shop = await Shop.findOne({slug: slug})

    if (!shop) {
        return NextResponse.json({ message: 'Магазин не найден' }, { status: 404 });
    }

    return NextResponse.json(shop);
}
