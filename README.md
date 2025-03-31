Hotel Room Booking System

📌 Project Overview

The Hotel Room Booking System is a RESTful API built using Node.js (Express.js) that allows users to:
Book a room by providing their details.
Retrieve booking details using an email address.
View all current guests staying in the hotel.
Cancel a booking by providing email and room details.
Modify an existing booking (change check-in or check-out dates).
This API stores booking data in-memory, meaning it will reset when the server restarts.

🚀 Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-repo/hotel-booking-api.git
cd hotel-booking-api

2️⃣ Install Dependencies

npm install

3️⃣ Run the Server

npm start

The API will be available at: http://localhost:3000

📌 API Endpoints

1️⃣ Book a Room

Endpoint: POST /api/book-room

{
"name": "John Doe",
"email": "john@example.com",
"phone": "1234567890",
"checkIn": "2025-04-01",
"checkOut": "2025-04-05"
}

Response:

{
"message": "Booking confirmed",
"booking": {
"roomNumber": 101,
"name": "John Doe",
"email": "john@example.com",
"checkIn": "2025-04-01",
"checkOut": "2025-04-05"
}
}

2️⃣ View Booking Details

Endpoint: GET /api/booking/:email
Response:

{
"roomNumber": 101,
"name": "John Doe",
"email": "john@example.com",
"phone": "1234567890",
"checkIn": "2025-04-01",
"checkOut": "2025-04-05"
}

3️⃣ View All Guests

Endpoint: GET /api/guests
Response:

[
{
"name": "John Doe",
"roomNumber": 101
}
]

4️⃣ Cancel a Booking

Endpoint: DELETE /api/cancel/:email/:bookingId
Response:

{
"message": "Booking cancelled successfully"
}

5️⃣ Modify Booking Details

Endpoint: PUT /api/modify/:bookingId
Request Body:

{
"emailId" : "john@example.com",
"checkIn": "2025-04-02",
"checkOut": "2025-04-05"
}

Response:

{
"message": "Booking modified successfully",
"booking": {
"checkIn": "2025-04-02",
"checkOut": "2025-04-05"
}
}

🧪 Running Tests

This project includes unit tests using Jest and Supertest.

Run Tests

npm test

🛠️ Technologies Used

Node.js (v16+)

Express.js

Jest & Supertest (for unit testing)

UUID (for unique booking IDs)

Moment.js (for date formatting)
