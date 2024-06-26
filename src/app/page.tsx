import dynamic from 'next/dynamic'
import {FloorProvider} from "@/contexts/FloorContext";
import {Metadata} from "next";

const DynamicMap = dynamic(() => import('../components/map/Map'), {
    ssr: false
});

export const metadata: Metadata = {
    title: 'Parking App',
    icons:{
        icon:'/favicon.svg'
    }
}

export default function Home() {
    return (
        <main>
            <FloorProvider>
                <div style={{position: "relative"}}>
                    <DynamicMap/>
                </div>
            </FloorProvider>
        </main>
    )
}