import React from 'react';
import calculatePolygonArea from "@/lib/utils/calculatePolygonArea";
import sanitizeHtmlString from "@/lib/utils/escapeHTML";
import splitTextByLineLength from "@/lib/utils/wrapText";
import {Marker, Pane} from "react-leaflet";
import getCenter from "@/lib/utils/getObjectCenter";
import {Icon} from "leaflet";
import classes from "@/components/map/map.module.scss";
import {IShop} from "@/models/Shop";

interface LabelsProps {
    shops: IShop[];
}


const Labels: React.FC<LabelsProps> = ({shops}) => {
    return (
        <Pane name="labels" style={{zIndex: 500}}>
            {shops.map((shop) => {
                const area = calculatePolygonArea(shop.coordinates);
                if (area < 9.697623681859113e-8) return null;

                const sanitizedSlug = sanitizeHtmlString(shop.slug);
                const lines = splitTextByLineLength(sanitizedSlug, 10);
                const svgText = lines.map((line, index) => `<tspan x="50%" dy="${index === 0 ? 0 : 15}">${line}</tspan>`).join('');

                return (
                    <Marker
                        key={shop._id}
                        position={getCenter(shop.coordinates)}
                        icon={new Icon({
                            iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" width="100" height="50">
                            <rect  width="100" height="50" fill="rgba(255, 255, 255, 0.0)" rx="5" ry="5"/>
                            <text  font-weight="700" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="black">${svgText}</text>
                        </svg>
                    `),
                            iconSize: [100, 50],
                            iconAnchor: [50, 25],
                            className: classes.shopLabel
                        })}
                    />
                );
            })}
        </Pane>
    );
};

export default Labels;