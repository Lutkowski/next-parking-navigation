'use client'

import classes from "./sidebar.module.css"
import {useFloor} from "@/contexts/FloorContext";

const Sidebar = () => {
    const {currentFloor, setCurrentFloor} = useFloor()
    const floors = [-2, -1, 1, 2, 3]

    return (
        <nav className={classes.sidebar}>
            <ul>
                {
                    floors.map((floor) => (
                        <li key={floor}>
                            <button value={floor} onClick={() => setCurrentFloor(floor)}>{floor}</button>
                        </li>
                    ))
                }
            </ul>
        </nav>
    );
};

export default Sidebar;