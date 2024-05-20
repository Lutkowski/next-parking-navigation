'use client'
import {createContext, ReactNode, useContext, useState} from "react";

interface FloorContextData {
    currentFloor: number,
    setCurrentFloor: (floor: number) => void
}

const FloorContext = createContext<FloorContextData | null>(null)

export const FloorProvider = ({children}: { children: ReactNode }) => {
    const [currentFloor, setCurrentFloor] = useState<number>(-1)
    return <FloorContext.Provider value={{currentFloor, setCurrentFloor}}>
        {children}
    </FloorContext.Provider>
}

export const useFloor = () => {
    const context = useContext(FloorContext)
    if (!context) {
        throw new Error('useFloor must be used within a FloorProvider');
    }
    return context;
}

