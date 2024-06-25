'use client'

import React, {useState} from "react";
import {LatLngExpression} from "leaflet";
import {useFloor} from "@/contexts/FloorContext";
import {useMap} from "react-leaflet";
import classes from "./search.module.scss";
import searchIcon from "../../../../public/search.svg"
import Image from "next/image";

interface SearchProps {
    setFoundShop: (name: string | null) => void;
}

const Search: React.FC<SearchProps> = ({setFoundShop}) => {

    const {currentFloor, setCurrentFloor} = useFloor()
    const map = useMap()

    const centerMap = (coordinates: LatLngExpression) => {
        map.setView(coordinates, 19);
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
        <div className={classes.search}>
            <input
                className={classes.searchForm}
                type="text"
                placeholder="Название магазина"
                value={search}
                onChange={event => {
                    setSearch(event.target.value)
                }}>
            </input>
            <button className={classes.searchButton} onClick={handleSearch}>
                <Image
                    src={searchIcon}
                    alt={"Иконка поиска"}
                    loading={"eager"}
                />
            </button>
        </div>
    );
};

export default Search;