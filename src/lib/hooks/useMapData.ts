import {IFacility} from "@/models/Facility";
import {IParkingPlace} from "@/models/ParkingPlace";
import {IShop} from "@/models/Shop";
import {IVoid} from "@/models/Void";
import {IPlacement} from "@/models/Placement";
import {IBorder} from "@/models/Border";
import {useCallback, useEffect, useState} from "react";
import {useFloor} from "@/contexts/FloorContext";

interface IMapData {
    parkingPlaces: IParkingPlace[];
    shops: IShop[];
    voids: IVoid[];
    placements: IPlacement[];
    borders: IBorder[];
    facilities: IFacility[];
}

export const useMapData = () => {
    const {currentFloor} = useFloor();
    const [data, setData] = useState<IMapData>({
        parkingPlaces: [],
        shops: [],
        voids: [],
        placements: [],
        borders: [],
        facilities: [],
    });

    const fetchData = useCallback(async (type: string) => {
        const response = await fetch(`/api/map?floor=${currentFloor}&type=${type}`);
        if (!response.ok) {
            throw new Error(`Error fetching ${type} data`);
        }
        return response.json();
    }, [currentFloor]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [parkingPlaces, shops, voids, placements, borders, facilities] = await Promise.all([
                    fetchData('parking'),
                    fetchData('shops'),
                    fetchData('voids'),
                    fetchData('placements'),
                    fetchData('borders'),
                    fetchData('facilities'),
                ]);

                setData({
                    parkingPlaces,
                    shops,
                    voids,
                    placements,
                    borders,
                    facilities,
                });
            } catch (error) {
                console.error('Error fetching map data:', error);
            }
        };

        loadData();
    }, [currentFloor, fetchData]);
    return data;
}