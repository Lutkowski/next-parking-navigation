import dbConnect from "@/lib/utils/dbConnect";
import ParkingPlace from "@/models/ParkingPlace";
import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import User from "@/models/User";
import findShopByName from "@/lib/utils/findShopByName";
import {graphs} from "@/lib/constants/graphs";
import findNodeByShopId from "@/lib/utils/findNodeById";
import buildRoute from "@/lib/utils/buildRoute";
import findNearestFacility from "@/lib/utils/findNearestFacility";
import findNearestToCoordinate from "@/lib/utils/findNearestToCoordinate";
import facility from "@/models/Facility";
import findNearestNodeToCoordinate from "@/lib/utils/findNearestToCoordinate";


const findUserParkingPlace = async (email: string) => {
    await dbConnect();
    const parkingPlace = await ParkingPlace.findOne({userEmail: email});
    return parkingPlace;
};

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);

    let startShopName = searchParams.get('startShopName');
    let endShopName = searchParams.get('endShopName');

    if (!startShopName || !endShopName) {
        return NextResponse.json({error: 'Both shops should be in request'}, {status: 400});
    }

    if (startShopName === endShopName) {
        return NextResponse.json({error: 'Start and end points must be different'}, {status: 400});
    }

    const token = await getToken({req});
    if (!token || !token.email) {
        return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    const userEmail = token.email;
    const user = await User.findOne({email: userEmail});
    if (!user) {
        return NextResponse.json({message: 'User not found'}, {status: 404});
    }

    let startShop = null;
    let endShop = null;

    if (startShopName === 'Мое парковочное место' && userEmail) {
        startShop = await findUserParkingPlace(userEmail);
        if (!startShop) {
            return NextResponse.json({error: 'No parking place found for the user'}, {status: 404});
        }
        startShopName = startShop._id;
    } else {
        startShop = await findShopByName(startShopName);
        if (!startShop) {
            return NextResponse.json({error: 'Start shop not found'}, {status: 404});
        }
    }

    if (endShopName === 'Мое парковочное место' && userEmail) {
        endShop = await findUserParkingPlace(userEmail);
        if (!endShop) {
            return NextResponse.json({error: 'No parking place found for the user'}, {status: 404});
        }
        endShopName = endShop._id;
    } else {
        endShop = await findShopByName(endShopName);
        if (!endShop) {
            return NextResponse.json({error: 'End shop not found'}, {status: 404});
        }
    }

    const startFloor = startShop.floor;
    const endFloor = endShop.floor;

    if (startFloor === endFloor) {
        // @ts-ignore
        const {graph, graphData} = graphs[startFloor];

        let startNodeId = findNodeByShopId(startShop._id, graphData);
        let endNodeId = findNodeByShopId(endShop._id, graphData);

        if (!startNodeId) {
            startNodeId = findNearestNodeToCoordinate(graphData, startShop.coordinates[0]);
        }

        if (!endNodeId) {
            endNodeId = findNearestNodeToCoordinate(graphData, endShop.coordinates[0]);
        }

        if (!startNodeId || !endNodeId) {
            return NextResponse.json({error: 'Graph node not found for the given shop'}, {status: 404});
        }

        const coordinates = buildRoute(graph, graphData, startNodeId, endNodeId);

        return NextResponse.json({startFloor: startFloor, startCoordinates: coordinates}, {status: 200});
    } else {
        // @ts-ignore
        const {graph: graphStart, graphData: graphStartData} = graphs[startFloor];
        // @ts-ignore
        const {graph: graphEnd, graphData: graphEndData} = graphs[endFloor];

        let startNodeId = findNodeByShopId(startShop._id, graphStartData);
        let endNodeId = findNodeByShopId(endShop._id, graphEndData);

        if (!startNodeId) {
            startNodeId = findNearestNodeToCoordinate(graphStartData, startShop.coordinates[0]);
        }

        if (!endNodeId) {
            endNodeId = findNearestNodeToCoordinate(graphEndData, endShop.coordinates[0]);
        }

        if (!startNodeId || !endNodeId) {
            return NextResponse.json({error: 'Graph node not found for the given shop'}, {status: 404});
        }
        await dbConnect()
        const facilities = await facility.find({})

        const nearestFacility = findNearestFacility(facilities, startShop.coordinates[0], startFloor, endFloor);

        if (!nearestFacility) {
            return NextResponse.json({error: 'No suitable facility found'}, {status: 404});
        }

        const facilityNodeId = nearestFacility._id;

        if (!facilityNodeId) {
            return NextResponse.json({error: 'Graph node not found for the facility'}, {status: 404});
        }

        const startCoordinates = buildRoute(graphStart, graphStartData, startNodeId, facilityNodeId);

        const facilityEndNodeId = findNearestToCoordinate(graphEndData, nearestFacility.coordinate);

        if (!facilityEndNodeId) {
            return NextResponse.json({error: 'Graph node not found for the facility on the end floor'}, {status: 404});
        }

        const endCoordinates = buildRoute(graphEnd, graphEndData, facilityEndNodeId, endNodeId);

        return NextResponse.json({
            startFloor: startFloor,
            endFloor: endFloor,
            startCoordinates: startCoordinates,
            endCoordinates: endCoordinates,
            facilityCoordinates: nearestFacility.coordinate
        }, {status: 200});
    }
}
