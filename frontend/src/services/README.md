# API Services

This directory contains all the API service functions used to communicate with the backend.

## Structure

- [api.ts](file:///c%3A/Users/Trezdev/OneDrive/Desktop/parking-management/frontend/src/services/api.ts) - Main API service with functions for all endpoints
- [index.ts](file:///c%3A/Users/Trezdev/OneDrive/Desktop/parking-management/frontend/src/services/index.ts) - Export file for easy imports

## Usage

### Importing the API service

```typescript
import { authApi, userApi, spacesApi } from '@/services/api';
// or
import { authApi } from '@/services';
```

### Using the API functions

```typescript
// Login example
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authApi.login(email, password);
    if (response.success) {
      // Handle successful login
      console.log('Login successful', response.data);
    }
  } catch (error) {
    // Handle error
    console.error('Login failed', error);
  }
};

// Fetching parking spaces
const fetchSpaces = async (token: string) => {
  try {
    const response = await spacesApi.getAll(token);
    setSpaces(response.data);
  } catch (error) {
    console.error('Failed to fetch spaces', error);
  }
};
```

## Available API Functions

### Auth API
- `authApi.login(email, password)`
- `authApi.register(userData)`
- `authApi.verify(token)`

### User API
- `userApi.getAll(token)`
- `userApi.getById(id, token)`
- `userApi.update(id, userData, token)`
- `userApi.delete(id, token)`

### Spaces API
- `spacesApi.getAll(token)`
- `spacesApi.getById(id, token)`
- `spacesApi.create(spaceData, token)`
- `spacesApi.update(id, spaceData, token)`
- `spacesApi.delete(id, token)`

### Bookings API
- `bookingsApi.getAll(token)`
- `bookingsApi.getById(id, token)`
- `bookingsApi.create(bookingData, token)`
- `bookingsApi.update(id, bookingData, token)`
- `bookingsApi.delete(id, token)`

### Vehicles API
- `vehiclesApi.getAll(token)`
- `vehiclesApi.getById(id, token)`
- `vehiclesApi.create(vehicleData, token)`
- `vehiclesApi.update(id, vehicleData, token)`
- `vehiclesApi.delete(id, token)`

### Payments API
- `paymentsApi.getAll(token)`
- `paymentsApi.getById(id, token)`
- `paymentsApi.create(paymentData, token)`
- `paymentsApi.update(id, paymentData, token)`

### Analytics API
- `analyticsApi.getDashboardData(token)`
- `analyticsApi.getRevenueData(token)`
- `analyticsApi.getOccupancyData(token)`