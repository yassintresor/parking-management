# Parking Management System - Backend

## Overview
This is the backend API for the Parking Management System, built with Node.js, Express, and MySQL.

## Features
- User authentication and authorization
- Parking space management
- Vehicle management
- Booking/reservation system
- Payment processing
- Analytics and reporting
- Swagger API documentation

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the .env file with your configuration.

5. Set up the database:
   - Create a MySQL database
   - Run the Schema.sql script to create tables
   - Update database credentials in .env

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Documentation
Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api-docs
```

## Docker Deployment
You can also run the application using Docker:
```bash
docker-compose up
```

## Project Structure
```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
└── app.js          # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify user token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/:id/bookings` - Get user bookings

### Parking Spaces
- `GET /api/spaces` - Get all parking spaces (Admin/Operator only)
- `GET /api/spaces/:id` - Get parking space by ID
- `POST /api/spaces` - Create parking space (Admin only)
- `PUT /api/spaces/:id` - Update parking space (Admin only)
- `DELETE /api/spaces/:id` - Delete parking space (Admin only)
- `GET /api/spaces/available` - Get available parking spaces
- `PUT /api/spaces/:id/status` - Update parking space status (Admin/Operator only)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings/:id/cancel` - Cancel booking

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `GET /api/vehicles/user/:userId` - Get user vehicles

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments` - Create payment
- `GET /api/payments/user/:userId` - Get user payments
- `POST /api/payments/:id/refund` - Refund payment

### Analytics & Reports
- `GET /api/analytics/occupancy` - Get occupancy report (Admin/Operator only)
- `GET /api/analytics/revenue` - Get revenue report (Admin/Operator only)
- `GET /api/analytics/usage` - Get usage report (Admin/Operator only)
- `GET /api/reports/daily` - Get daily report (Admin/Operator only)
- `GET /api/reports/monthly` - Get monthly report (Admin/Operator only)

## Environment Variables
- `PORT` - Server port (default: 3000)
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License.