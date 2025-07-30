# Movie Booking System - Backend

A complete backend API for a movie booking system built with Express.js and MongoDB.

## Features

- User authentication and authorization
- Movie management
- Theater management
- Show scheduling
- Seat booking system
- Booking management
- JWT token-based authentication
- Role-based access control (User/Admin)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `config.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie_booking
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
```

3. Make sure MongoDB is running on your local machine.

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/:id` - Get theater by ID
- `POST /api/theaters` - Create theater (Admin only)
- `PUT /api/theaters/:id` - Update theater (Admin only)
- `DELETE /api/theaters/:id` - Delete theater (Admin only)

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/movie/:movieId` - Get shows by movie
- `GET /api/shows/:id` - Get show by ID
- `POST /api/shows` - Create show (Admin only)
- `PUT /api/shows/:id` - Update show (Admin only)
- `DELETE /api/shows/:id` - Delete show (Admin only)

### Bookings
- `GET /api/bookings` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get booking by ID (Protected)
- `POST /api/bookings` - Create booking (Protected)
- `PUT /api/bookings/:id/status` - Update booking status (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)

## Database Models

### User
- name, email, password, phone, role, createdAt

### Movie
- title, description, genre, duration, releaseDate, language, rating, poster, trailer, director, cast, isActive, createdAt

### Theater
- name, location, address, city, state, pincode, phone, totalScreens, amenities, isActive, createdAt

### Show
- movie, theater, screenNumber, date, time, price, totalSeats, availableSeats, isActive, createdAt

### Booking
- user, show, movie, theater, seats, totalAmount, bookingDate, showDate, showTime, status, paymentStatus, bookingId, createdAt

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error 