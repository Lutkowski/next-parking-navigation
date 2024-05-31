import React, {useState} from "react";
import {LatLngExpression} from "leaflet";
import {useFloor} from "@/contexts/FloorContext";
import {useMap} from "react-leaflet";

interface SearchProps {
    setFoundShop: (name: string | null) => void;
}

const Search: React.FC<SearchProps> = ({setFoundShop}) => {

    const {currentFloor, setCurrentFloor} = useFloor()
    const map = useMap()

    const centerMap = (coordinates: LatLngExpression) => {
        map.setView(coordinates, 21);
    }

    const handleSearch = async () => {
        const response = await fetch(`/api/shop?slug=${search}`)
        if (response.ok) {
            const shop = await response.json();
            const {slug, coordinates, floor} = shop;
            console.log(shop)
            setFoundShop(slug)
            centerMap(coordinates[0])
            setCurrentFloor(floor)

        } else {
            alert('Магазин не найден');
        }
    }

    const [search, setSearch] = useState('')

    return (
        <div style={{position: "absolute", zIndex: 1000, top: "10px", left: "10px"}}>
            <input
                type="text"
                placeholder="Название магазина"
                value={search}
                onChange={event => {
                    setSearch(event.target.value)
                }}>
            </input>
            <button onClick={handleSearch}>
                Искать
            </button>
        </div>
    );
};

export default Search;