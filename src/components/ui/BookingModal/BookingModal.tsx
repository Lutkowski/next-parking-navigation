import React, { useState } from 'react';
import classes from './bookingModal.module.scss';
import MyButton from '@/components/ui/myButton/MyButton';

interface BookingModalProps {
    place: any;
    onClose: () => void;
    onBook: (bookingEnd: string) => void;
    onCancel: () => void;
    userEmail: string | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ place, onClose, onBook, onCancel, userEmail }) => {
    const [bookingEnd, setBookingEnd] = useState('');

    const handleBooking = () => {
        onBook(bookingEnd);
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modal}>
                <div className={classes.modalContent}>
                    {place.userEmail === userEmail ? (
                        <>
                            <h2>Ваше бронирование</h2>
                            <p>Место забронировано до: {new Date(place.bookingEnd).toLocaleString()}</p>
                            <MyButton onClick={onCancel}>Отменить бронирование</MyButton>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                    <MyButton onClick={onClose}>Отмена</MyButton>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
