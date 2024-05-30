import {createControlComponent} from '@react-leaflet/core';
import {control} from "leaflet";


const Zoom = createControlComponent(() => {
    return control.zoom({
        position: 'topright',
    });
});

export default Zoom;
