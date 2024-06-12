import React, {useState} from 'react';
import classes from './bookingModal.module.scss';
import MyButton from '@/components/ui/myButton/MyButton';

interface BookingModalProps {
    onClose: () => void;
    onBook: (bookingEnd: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({onClose, onBook}) => {
    const [bookingEnd, setBookingEnd] = useState('');

    const handleBooking = () => {
        onBook(bookingEnd);
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    <h2>Забронировать место</h2>
                    <label>
                        Время окончания бронирования:
                        <input
                            type="datetime-local"
                            value={bookingEnd}
                            onChange={(e) => setBookingEnd(e.target.value)}
                        />
                    </label>
                    <MyButton onClick={handleBooking}>Забронировать</MyButton>
                    <MyButton onClick={onClose}>Отмена</MyButton>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
