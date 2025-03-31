const createBookingController = (bookingService) => {
    return {
        bookRoom: (req, res) => {
            const result = bookingService.bookRoom(req.body);
            res.status(result.status).json(result.data);
        },

        getBooking: (req, res) => {
            const result = bookingService.getBooking(req.params.email);
            res.status(result.status).json(result.data);
        },

        getAllGuests: (req, res) => {
            const result = bookingService.getAllGuests();
            res.status(result.status).json(result.data);
        },

        cancelBooking: (req, res) => {
            const result = bookingService.cancelBooking(req.params.email,req.params.bookingId);
            res.status(result.status).json(result.data);
        },

        modifyBooking: (req, res) => {
            const result = bookingService.modifyBooking(req.params.bookingId, req.body);
            res.status(result.status).json(result.data);
        }
    };
};

module.exports = createBookingController;
