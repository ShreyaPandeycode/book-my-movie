# Movie Booking System

A complete full-stack movie booking system built with Express.js, MongoDB, React, and Tailwind CSS.

## Features

### Backend Features
- **User Authentication**: JWT-based authentication with registration and login
- **Movie Management**: CRUD operations for movies with details like title, description, genre, duration, etc.
- **Theater Management**: Manage theaters with location, screens, and amenities
- **Show Scheduling**: Create and manage movie shows with dates, times, and pricing
- **Booking System**: Seat selection and booking management
- **Role-based Access**: Admin and user roles with different permissions
- **RESTful API**: Complete REST API with proper error handling

### Frontend Features
- **Modern UI**: Beautiful and responsive design with Tailwind CSS
- **User Authentication**: Login and registration forms with validation
- **Movie Browsing**: Browse movies with search and filter functionality
- **Movie Details**: Detailed movie information with available shows
- **Seat Selection**: Interactive seat selection interface
- **Booking Management**: View and cancel bookings
- **Real-time Updates**: Toast notifications for user feedback

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

### Frontend
- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `config.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie_booking
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
```

4. Make sure MongoDB is running on your local machine.

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

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

## Usage

### For Users
1. Register a new account or login with existing credentials
2. Browse available movies on the home page
3. Click on a movie to view details and available shows
4. Select a show and choose your seats
5. Confirm the booking
6. View and manage your bookings in the "My Bookings" section

### For Admins
1. Login with admin credentials
2. Access admin features through the API endpoints
3. Manage movies, theaters, and shows
4. Monitor bookings and user activities

## Project Structure

```
Project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theater.js
│   │   ├── Show.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── theaters.js
│   │   ├── shows.js
│   │   └── bookings.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── config.env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Movies.tsx
    │   │   ├── MovieDetail.tsx
    │   │   ├── Booking.tsx
    │   │   └── MyBookings.tsx
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team. 