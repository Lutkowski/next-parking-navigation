import { NextRequest, NextResponse } from 'next/server';
import { dijkstraUndirected, getPath } from '@/lib/utils/dijkstra';
import { graph3, graphData3 } from '@/lib/constants/graphs/graph3';
import dbConnect from "@/lib/utils/dbConnect";
import Shop from "@/models/Shop";

const findShopIdByName = async (name: string): Promise<string | null> => {
    await dbConnect();
    const shop = await Shop.findOne({ slug: name });
    if (shop) {
        return shop._id;
    }
    return null;
};

const findNodeByShopId = (shopId: string): string | null => {
    const node = graphData3.nodes.find((n: any) => n.id === shopId);
    return node ? node.id : null;
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const startShopName = searchParams.get('startShopName');
    const endShopName = searchParams.get('endShopName');

    if (!startShopName || !endShopName) {
        return NextResponse.json({ error: 'Both startShopName and endShopName are required' }, { status: 400 });
    }

    const startShopId = await findShopIdByName(startShopName);
    const endShopId = await findShopIdByName(endShopName);

    if (!startShopId || !endShopId) {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const startNodeId = findNodeByShopId(startShopId);
    const endNodeId = findNodeByShopId(endShopId);

    if (!startNodeId || !endNodeId) {
        return NextResponse.json({ error: 'Graph node not found for the given shop' }, { status: 404 });
    }

    const graph = graph3;

    const { previous } = dijkstraUndirected(graph, startNodeId);
    const path = getPath(previous, startNodeId, endNodeId);
    const coordinates = path.map(node => {
        const graphNode = graphData3.nodes.find((n: any) => n.id === node);
        if (!graphNode) {
            throw new Error(`Node with id ${node} not found in graph data`);
        }
        return graphNode.coordinates as [number, number];
    });

    return NextResponse.json({floor:3, coordinates :coordinates}, { status: 200 });
}
