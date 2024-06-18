import {IParkingPlace} from "@/models/ParkingPlace";

const getParkingColor = (place: IParkingPlace, userEmail: string | null) => {
    if (place.bookingEnd) {
        const now = new Date();
        const bookingEnd = new Date(place.bookingEnd);

        if (now <= bookingEnd) {
            return place.userEmail === userEmail ? 'yellow' : 'red';
        }
    }
    return 'green';
};

export default getParkingColor