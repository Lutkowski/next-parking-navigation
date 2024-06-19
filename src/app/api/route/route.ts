import {NextRequest, NextResponse} from 'next/server';
import {graphs} from '@/lib/constants/graphs';
import findShopByName from "@/lib/utils/findShopByName";
import buildRoute from "@/lib/utils/buildRoute";
import findNodeByShopId from "@/lib/utils/findNodeById";
import dbConnect from "@/lib/utils/dbConnect";
import Facility from "@/models/Facility";
import findNearestFacility from "@/lib/utils/findNearestFacility";
import findNearestNodeToCoordinate from "@/lib/utils/findNearestToCoordinate";


export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);

    const startShopName = searchParams.get('startShopName');
    const endShopName = searchParams.get('endShopName');

    if (!startShopName || !endShopName) {
        return NextResponse.json({error: 'Both shops should be in request'}, {status: 404});
    }

    const startShop = await findShopByName(startShopName);
    const endShop = await findShopByName(endShopName);

    const startFloor = startShop.floor;
    const endFloor = endShop.floor;

    if (startFloor === endFloor) {
        // @ts-ignore
        const {graph, graphData} = graphs[startFloor];


        const startNodeId = findNodeByShopId(startShop._id, graphData);
        const endNodeId = findNodeByShopId(endShop._id, graphData);

        if (!startNodeId || !endNodeId) {
            return NextResponse.json({error: 'Graph node not found for the given shop'}, {status: 404});
        }

        const coordinates = buildRoute(graph, graphData, startNodeId, endNodeId);

        return NextResponse.json({startFloor: startFloor, startCoordinates: coordinates}, {status: 200});
    } else {
        // @ts-ignore
        const {graph: graphStart, graphData: graphStartData} = graphs[startFloor];
        // @ts-ignore
        const {graph: graphEnd, graphData: graphEndData } = graphs[endFloor];


        const startNodeId = findNodeByShopId(startShop._id, graphStartData);
        const endNodeId = findNodeByShopId(endShop._id, graphEndData);

        if (!startNodeId || !endNodeId) {
            return NextResponse.json({error: 'Graph node not found for the given shop'}, {status: 404});
        }

        await dbConnect()
        const facilities = await Facility.find();
        const nearestFacility = findNearestFacility(facilities, startShop.coordinates[0], startFloor, endFloor);

        if (!nearestFacility) {
            return NextResponse.json({error: 'No suitable facility found for floor transfer'}, {status: 404});
        }

        const startCoordinates = buildRoute(graphStart, graphStartData, startNodeId, nearestFacility._id);

        const nearestNodeToFacility = findNearestNodeToCoordinate(graphEndData, nearestFacility.coordinate);
        if (!nearestNodeToFacility) {
            return NextResponse.json({error: 'No suitable node found in the end floor graph'}, {status: 404});
        }

        const endCoordinates = buildRoute(graphEnd, graphEndData, nearestNodeToFacility, endNodeId);

        return NextResponse.json({
            startFloor: startFloor,
            startCoordinates: startCoordinates,
            facilityCoordinates: nearestFacility.coordinate,
            endFloor: endFloor,
            endCoordinates: endCoordinates
        }, {status: 200});
    }
}
