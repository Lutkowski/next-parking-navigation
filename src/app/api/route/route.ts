import { NextRequest, NextResponse } from 'next/server';
import { dijkstraUndirected, getPath } from '@/lib/utils/dijkstra';
import { graphs } from '@/lib/constants/graphs';
import dbConnect from "@/lib/utils/dbConnect";
import Shop from "@/models/Shop";

const findShopByName = async (name: string) => {
    await dbConnect();
    const shop = await Shop.findOne({ slug: name });
    return shop;
};

const findNodeByShopId = (shopId: string, graphData: any): string | null => {
    const node = graphData.nodes.find((n: any) => n.id === shopId);
    return node ? node.id : null;
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const startShopName = searchParams.get('startShopName');
    const endShopName = searchParams.get('endShopName');

    if (!startShopName || !endShopName) {
        return NextResponse.json({ error: 'Both startShopName and endShopName are required' }, { status: 400 });
    }

    const startShop = await findShopByName(startShopName);
    const endShop = await findShopByName(endShopName);

    if (!startShop || !endShop) {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const startFloor = startShop.floor;
    const endFloor = endShop.floor;

    if (startFloor !== endFloor) {
        return NextResponse.json({ error: 'Shops are on different floors' }, { status: 400 });
    }

    // @ts-ignore
    const { graph, graphData } = graphs[startFloor];

    const startNodeId = findNodeByShopId(startShop._id, graphData);
    const endNodeId = findNodeByShopId(endShop._id, graphData);

    if (!startNodeId || !endNodeId) {
        return NextResponse.json({ error: 'Graph node not found for the given shop' }, { status: 404 });
    }

    const { previous } = dijkstraUndirected(graph, startNodeId);
    const path = getPath(previous, startNodeId, endNodeId);
    const coordinates = path.map(node => {
        const graphNode = graphData.nodes.find((n: any) => n.id === node);
        if (!graphNode) {
            throw new Error(`Node with id ${node} not found in graph data`);
        }
        return graphNode.coordinates as [number, number];
    });

    return NextResponse.json({ floor: startFloor, coordinates }, { status: 200 });
}
