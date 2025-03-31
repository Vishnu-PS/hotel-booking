const request = require("supertest");
const express = require("express");
const createBookingController = require("../app/controller/booking.controller");
const { checkout } = require("../app/routers");

describe("Booking Controller", () => {
    let app, bookingServiceMock;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        bookingServiceMock = {
            bookRoom: jest.fn(),
            getBooking: jest.fn(),
            getAllGuests: jest.fn(),
            cancelBooking: jest.fn(),
            modifyBooking: jest.fn()
        };

        const bookingController = createBookingController(bookingServiceMock);

        app.post("/book-room", bookingController.bookRoom);
        app.get("/booking/:email", bookingController.getBooking);
        app.get("/guests", bookingController.getAllGuests);
        app.delete("/cancel/:email/:bookingId", bookingController.cancelBooking);
        app.put("/modify/:bookingId", bookingController.modifyBooking);
    });

    test("Should book a room successfully", async () => {
        bookingServiceMock.bookRoom.mockReturnValue({
            status: 200,
            data: { message: "Booking confirmed", booking: { roomNumber: 101 } }
        });

        const res = await request(app).post("/book-room").send({
            name: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            checkIn: "2025-04-01",
            checkOut: "2025-04-05"
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Booking confirmed");
        expect(res.body.booking.roomNumber).toBe(101);
    });

    test("Should return 404 for non-existent booking", async () => {
        bookingServiceMock.getBooking.mockReturnValue({
            status: 404,
            data: { message: "Booking not found" }
        });

        const res = await request(app).get("/booking/nonexistent@example.com");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Booking not found");
    });

    test("Should return all guests", async () => {
        bookingServiceMock.getAllGuests.mockReturnValue({
            status: 200,
            data: [{ name: "Alice", roomNumber: 102 }]
        });

        const res = await request(app).get("/guests");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe("Alice");
    });

    test("Should cancel a booking", async () => {
        bookingServiceMock.cancelBooking.mockReturnValue({
            status: 200,
            data: { message: "Booking cancelled successfully" }
        });

        const res = await request(app).delete("/cancel/john@example.com/1234");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Booking cancelled successfully");
    });

    test("Should modify booking details", async () => {
        bookingServiceMock.modifyBooking.mockReturnValue({
            status: 200,
            data: { message: "Booking modified successfully", booking: { checkIn: "2025-04-02" } }
        });

        const res = await request(app).put("/modify/1234").send({
            emailId: "john@example.com",
            checkIn: "2025-04-02",
            checkOut: "2025-04-05"
        });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Booking modified successfully");
        expect(res.body.booking.checkIn).toBe("2025-04-02");
    });
});
