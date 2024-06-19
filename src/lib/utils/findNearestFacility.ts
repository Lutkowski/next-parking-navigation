import {IFacility} from "@/models/Facility";

const findNearestFacility = (
    facilities: IFacility[],
    startCoordinate: [number, number],
    startFloor: number,
    endFloor: number
): IFacility | null => {
    let nearestFacility: IFacility | null = null;
    let minDistance = Infinity;
    const startCoord = [Number(startCoordinate[0]), Number(startCoordinate[1])];

    for (const facility of facilities) {
        if (
            facility.floor === startFloor &&
            facility.topFloor !== undefined &&
            facility.bottomFloor !== undefined &&
            facility.topFloor >= endFloor &&
            facility.bottomFloor <= startFloor
        ) {
            const facilityCoord = [Number(facility.coordinate[0]), Number(facility.coordinate[1])];

            const distance = Math.sqrt(
                Math.pow(facilityCoord[0] - startCoord[0], 2) +
                Math.pow(facilityCoord[1] - startCoord[1], 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestFacility = facility;
            }
        }
    }

    return nearestFacility;
};

export default findNearestFacility;
