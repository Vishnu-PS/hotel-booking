const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

let rooms = [
    { number: 101, available: true },
    { number: 102, available: true },
    { number: 103, available: true }
];

let bookings = [];

exports.bookRoom = (data) => {
    try {

        const { name, email, phone, checkIn, checkOut } = data;

        if (!name || !email || !phone || !checkIn || !checkOut) {
            return { status: 400, data: { message: "All fields are required" } };
        }
        if (moment(checkIn).isBefore(moment().startOf("day"))) return { status: 400, data: { message: "Pre-dated bookings not allowed." } };

        let room = rooms.find(r =>
            r.available && !bookings.some(b =>
                b.roomNumber === r.number &&
                moment(checkIn).isBefore(b.checkOut, "day") &&
                moment(checkOut).isAfter(b.checkIn, "day")
            )
        );


        if (!room) {
            return { status: 400, data: { message: "No rooms available for the selected dates" } };
        }

        const booking = {
            id: uuidv4(),
            roomNumber: room.number,
            name,
            email,
            phone,
            checkIn: moment(checkIn).format("YYYY-MM-DD"),
            checkOut: moment(checkOut).format("YYYY-MM-DD")
        };

        bookings.push(booking);

        return { status: 200, data: { message: "Booking confirmed", booking } };
    } catch (error) {
        console.error("Error in room Booking:", error);
        return { status: 500, data: { message: "Something went wrong. Please try again later." } };
    }
};


exports.getBooking = (email) => {
    try {
        const booking = bookings.filter(b => b.email === email);
        return booking.length > 1
            ? { status: 200, data: booking }
            : { status: 404, data: { message: "Booking not found" } };
    } catch (error) {
        console.error("Error in fetching booking details:", error);
        return { status: 500, data: { message: "Something went wrong. Please try again later." } };
    }
};

exports.getAllGuests = () => {
    try {
        const today = moment().format("YYYY-MM-DD");

        const guestMap = new Map();

        bookings.forEach(b => {
            if (moment(today).isBetween(b.checkIn, b.checkOut, null, "[]")) {
                const key = `${b.name}-${b.email}`;
                if (guestMap.has(key)) {
                    guestMap.get(key).roomNumbers.push(b.roomNumber);
                } else {
                    guestMap.set(key, {
                        name: b.name,
                        email: b.email,
                        roomNumbers: [b.roomNumber]
                    });
                }
            }
        });

        const guests = Array.from(guestMap.values());

        return guests.length > 0
            ? { status: 200, data: guests }
            : { status: 404, data: { message: "No guests currently staying" } };
    } catch (error) {
        console.error("Error in fetching guests:", error);
        return { status: 500, data: { message: "Something went wrong. Please try again later." } };
    }
};



exports.cancelBooking = (email, bookingId) => {
    try {
        const today = moment().format("YYYY-MM-DD");
        const index = bookings.findIndex(b =>
            b.email === email &&
            b.id == bookingId &&
            moment(today).isBefore(b.checkOut) // Only allow cancellations before check-out
        );

        if (index === -1) {
            return { status: 404, data: { message: "Booking not found or cannot be canceled" } };
        }
        let cancelledRoom = bookings[index].roomNumber;
        bookings.splice(index, 1);

        const room = rooms.find(r => r.number === cancelledRoom);

        return { status: 200, data: { message: `Booking for room ${cancelledRoom} cancelled successfully` } };

    } catch (error) {
        console.error("Error in room Cancelling:", error);
        return { status: 500, data: { message: "Something went wrong. Please try again later." } };
    }
};


exports.modifyBooking = (bookingId, data) => {
    try {

        if (!data.email || !data.checkIn || !data.checkOut) {
            return { status: 400, data: { message: "All fields are required" } };
        }
        let booking = bookings.find(b => b.id === bookingId && b.email === data.email);
        if (!booking) {
            return { status: 404, data: { message: "Booking not found" } };
        }

        let newCheckIn = data.checkIn ? moment(data.checkIn).format("YYYY-MM-DD") : booking.checkIn;
        let newCheckOut = data.checkOut ? moment(data.checkOut).format("YYYY-MM-DD") : booking.checkOut;

        const room = rooms.find(r =>
            r.available && !bookings.some(b =>
                b.roomNumber === r.number &&
                moment(newCheckIn).isBefore(b.checkOut, "day") &&
                moment(newCheckOut).isAfter(b.checkIn, "day")
            )
        );

        if (!room) {
            return { status: 400, data: { message: "Room is not available for the new dates" } };
        }

        booking.checkIn = moment(newCheckIn).format("YYYY-MM-DD");
        booking.checkOut = moment(newCheckOut).format("YYYY-MM-DD")
        booking.roomNumber = room.number

        return { status: 200, data: { message: "Booking modified successfully", booking } };
    } catch (error) {
        console.error("Error in Modifying booking:", error);
        return { status: 500, data: { message: "Something went wrong. Please try again later." } };
    }
};