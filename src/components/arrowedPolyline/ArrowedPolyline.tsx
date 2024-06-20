import React, { useEffect, useRef } from 'react';
import { Polyline as LeafletPolyline, useMap } from 'react-leaflet';
import L, { LatLngExpression, Polyline as LeafletPolylineType } from 'leaflet';
import 'leaflet-arrowheads';

interface ArrowedPolylineProps {
    positions: LatLngExpression[];
    color?: string;
    weight?: number;
    arrowOptions?: any;
}

const ArrowedPolyline: React.FC<ArrowedPolylineProps> = ({ positions, color = 'blue', weight = 5, arrowOptions }) => {
    const map = useMap();
    const polylineRef = useRef<LeafletPolylineType | null>(null);

    useEffect(() => {
        if (polylineRef.current) {
            polylineRef.current.remove();
        }

        const polyline = new L.Polyline(positions, { color, weight });
        polyline.addTo(map);
        polyline.arrowheads(arrowOptions);
        polylineRef.current = polyline;

        return () => {
            if (polylineRef.current) {
                polylineRef.current.remove();
            }
        };
    }, [positions, color, weight, arrowOptions, map]);

    return null;
};

export default ArrowedPolyline;
