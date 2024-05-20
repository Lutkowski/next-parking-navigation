import dynamic from 'next/dynamic'
import {FloorProvider} from "@/contexts/FloorContext";
import Sidebar from "@/components/ui/sidebar/Sidebar";

const DynamicMap = dynamic(() => import('../components/Map'), {
    ssr: false
});

export default function Home() {
    return (
        <main>
            <FloorProvider>
                <div style={{position: "relative"}}>
                    <DynamicMap/>
                    <Sidebar/>
                </div>
            </FloorProvider>
        </main>
    )
}