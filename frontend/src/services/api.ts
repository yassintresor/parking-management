// api.ts - Centralized API service for communicating with the backend
import { toast } from "sonner";

// Get the base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Generic fetch function with error handling
const apiFetch = async (endpoint: string, options: RequestInit = {}, token?: string) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`API Request to: ${url}`, options);
  
  // Get auth token from localStorage if available and not provided
  const authToken = token || localStorage.getItem('auth_token');
  
  // Set default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (authToken) {
    defaultHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  // Merge default headers with any provided headers
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, options);
    console.log(`API Response from: ${url}`, response.status, response.statusText);
    
    // Handle 401 Unauthorized responses by clearing auth and redirecting
    if (response.status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
      throw new Error('Unauthorized: Please log in again');
    }
    
    // Handle network errors
    if (!response.ok) {
      // Try to parse error response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.log(`API Error Response JSON from: ${url}`, errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log(`API Response JSON from: ${url}`, data);
      
      // If response contains a new token, update it in localStorage
      if (data.data && data.data.token) {
        localStorage.setItem('auth_token', data.data.token);
      }
      
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.error("API Error:", error);
    // Only show toast for network errors, not for application errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      toast.error("Network error: Unable to connect to server");
    }
    throw error;
  }
};

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  register: async (userData: { email: string; password: string; name: string; phone: string }) => {
    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  verify: async (token?: string) => {
    try {
      // Use provided token or get from localStorage
      const authToken = token || localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('No authentication token available');
      }
      
      const response = await apiFetch("/api/auth/verify", {}, authToken);
      return response;
    } catch (error) {
      console.error('Verify API error:', error);
      throw error;
    }
  },
};

// User API functions
export const userApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/users", {}, token);
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/users/${id}`, {}, token);
  },

  create: async (userData: any, token: string) => {
    console.log('Sending user creation request with data:', userData);
    return apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }, token);
  },

  update: async (id: string, userData: any, token: string) => {
    return apiFetch(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }, token);
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/users/${id}`, {
      method: "DELETE",
    }, token);
  },
};

// Parking Spaces API functions
export const spacesApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/spaces", {}, token);
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/spaces/${id}`, {}, token);
  },

  create: async (spaceData: any, token: string) => {
    return apiFetch("/api/spaces", {
      method: "POST",
      body: JSON.stringify(spaceData),
    }, token);
  },

  update: async (id: string, spaceData: any, token: string) => {
    return apiFetch(`/api/spaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(spaceData),
    }, token);
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/spaces/${id}`, {
      method: "DELETE",
    }, token);
  },

  getAvailable: async () => {
    return apiFetch("/api/spaces/available");
  },
  
  getAvailableCount: async () => {
    return apiFetch("/api/spaces/available/count");
  },
};

// Bookings API functions
export const bookingsApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/bookings", {}, token);
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/bookings/${id}`, {}, token);
  },

  create: async (bookingData: any, token: string) => {
    return apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }, token);
  },

  update: async (id: string, bookingData: any, token: string) => {
    return apiFetch(`/api/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookingData),
    }, token);
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/bookings/${id}`, {
      method: "DELETE",
    }, token);
  },

  getUserBookings: async (userId: string, token: string) => {
    return apiFetch(`/api/bookings/user/${userId}`, {}, token);
  },

  cancel: async (id: string, token: string) => {
    return apiFetch(`/api/bookings/${id}/cancel`, {
      method: "POST",
    }, token);
  },
};

// Vehicles API functions
export const vehiclesApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/vehicles", {}, token);
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/vehicles/${id}`, {}, token);
  },

  create: async (vehicleData: any, token: string) => {
    return apiFetch("/api/vehicles", {
      method: "POST",
      body: JSON.stringify(vehicleData),
    }, token);
  },

  update: async (id: string, vehicleData: any, token: string) => {
    return apiFetch(`/api/vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    }, token);
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/vehicles/${id}`, {
      method: "DELETE",
    }, token);
  },
  
  // Add function to get user's vehicles
  getUserVehicles: async (userId: string, token: string) => {
    return apiFetch(`/api/vehicles/user/${userId}`, {}, token);
  },
};

// Payments API functions
export const paymentsApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/payments", {}, token);
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/payments/${id}`, {}, token);
  },

  create: async (paymentData: any, token: string) => {
    return apiFetch("/api/payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }, token);
  },

  update: async (id: string, paymentData: any, token: string) => {
    return apiFetch(`/api/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    }, token);
  },
};

// Analytics API functions
export const analyticsApi = {
  getDashboardData: async (token: string) => {
    try {
      // Fetch all required data in parallel
      const [occupancyRes, spacesRes, usersRes, bookingsRes, paymentsRes] = await Promise.all([
        apiFetch("/api/analytics/occupancy", {}, token),
        apiFetch("/api/spaces", {}, token),
        apiFetch("/api/users", {}, token),
        apiFetch("/api/bookings", {}, token),
        apiFetch("/api/payments", {}, token)
      ]);

      // Combine data for dashboard
      const dashboardData: any = {};
      
      // Process occupancy data
      if (occupancyRes.success && occupancyRes.data && occupancyRes.data.length > 0) {
        // Aggregate occupancy data across all space types
        const totalSpaces = occupancyRes.data.reduce((sum: number, item: any) => sum + item.total_spaces, 0);
        const availableSpaces = occupancyRes.data.reduce((sum: number, item: any) => sum + item.available_spaces, 0);
        const occupiedSpaces = occupancyRes.data.reduce((sum: number, item: any) => sum + item.occupied_spaces, 0);
        const reservedSpaces = occupancyRes.data.reduce((sum: number, item: any) => sum + item.reserved_spaces, 0);
        const occupancyRate = totalSpaces > 0 ? ((occupiedSpaces + reservedSpaces) / totalSpaces) * 100 : 0;
        
        dashboardData.total_spaces = totalSpaces;
        dashboardData.available_spaces = availableSpaces;
        dashboardData.occupied_spaces = occupiedSpaces;
        dashboardData.reserved_spaces = reservedSpaces;
        dashboardData.occupancy_rate = parseFloat(occupancyRate.toFixed(2));
      } else if (spacesRes.success && spacesRes.data && spacesRes.data.length > 0) {
        // Fallback to counting spaces directly if occupancy report fails
        dashboardData.total_spaces = spacesRes.data.length;
        const availableSpaces = spacesRes.data.filter((space: any) => space.status === 'AVAILABLE').length;
        const occupiedSpaces = spacesRes.data.filter((space: any) => space.status === 'OCCUPIED').length;
        const reservedSpaces = spacesRes.data.filter((space: any) => space.status === 'RESERVED').length;
        const occupancyRate = dashboardData.total_spaces > 0 ? 
          ((occupiedSpaces + reservedSpaces) / dashboardData.total_spaces) * 100 : 0;
        
        dashboardData.available_spaces = availableSpaces;
        dashboardData.occupied_spaces = occupiedSpaces;
        dashboardData.reserved_spaces = reservedSpaces;
        dashboardData.occupancy_rate = parseFloat(occupancyRate.toFixed(2));
      }
      
      // Process other data
      if (usersRes.success && usersRes.data) {
        dashboardData.total_users = usersRes.data.length;
      }
      
      if (bookingsRes.success && bookingsRes.data) {
        dashboardData.total_bookings = bookingsRes.data.length;
      }
      
      if (paymentsRes.success && paymentsRes.data) {
        // Calculate total revenue from paid payments
        const paidPayments = paymentsRes.data.filter((p: any) => p.status === 'PAID');
        dashboardData.total_revenue = paidPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      }
      
      return {
        success: true,
        data: dashboardData
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  getRevenueData: async (token: string) => {
    return apiFetch("/api/analytics/revenue", {}, token);
  },

  getOccupancyData: async (token: string) => {
    return apiFetch("/api/analytics/occupancy", {}, token);
  },

  getUsageData: async (token: string) => {
    return apiFetch("/api/analytics/usage", {}, token);
  },

  getDailyData: async (token: string) => {
    return apiFetch("/api/analytics/daily", {}, token);
  },

  getMonthlyData: async (token: string) => {
    return apiFetch("/api/analytics/monthly", {}, token);
  },
};

export default {
  authApi,
  userApi,
  spacesApi,
  bookingsApi,
  vehiclesApi,
  paymentsApi,
  analyticsApi,
};