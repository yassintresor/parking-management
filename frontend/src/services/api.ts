// api.ts - Centralized API service for communicating with the backend
import { toast } from "sonner";

// Get the base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Generic fetch function with error handling
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`API Request to: ${url}`, options);
  
  // Get auth token from localStorage if available
  const token = localStorage.getItem('auth_token');
  
  // Set default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Merge default headers with any provided headers
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(url, options);
    console.log(`API Response from: ${url}`, response.status, response.statusText);
    
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
      
      const response = await apiFetch("/api/auth/verify", {
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
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
    return apiFetch("/api/users", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/users/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  create: async (userData: any, token: string) => {
    console.log('Sending user creation request with data:', userData);
    return apiFetch("/api/users", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  update: async (id: string, userData: any, token: string) => {
    return apiFetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },
};

// Parking Spaces API functions
export const spacesApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/spaces", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/spaces/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  create: async (spaceData: any, token: string) => {
    return apiFetch("/api/spaces", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(spaceData),
    });
  },

  update: async (id: string, spaceData: any, token: string) => {
    return apiFetch(`/api/spaces/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(spaceData),
    });
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/spaces/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
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
    return apiFetch("/api/bookings", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/bookings/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  create: async (bookingData: any, token: string) => {
    return apiFetch("/api/bookings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  },

  update: async (id: string, bookingData: any, token: string) => {
    return apiFetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/bookings/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },
};

// Vehicles API functions
export const vehiclesApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/vehicles", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/vehicles/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  create: async (vehicleData: any, token: string) => {
    return apiFetch("/api/vehicles", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });
  },

  update: async (id: string, vehicleData: any, token: string) => {
    return apiFetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    });
  },

  delete: async (id: string, token: string) => {
    return apiFetch(`/api/vehicles/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },
  
  // Add function to get user's vehicles
  getUserVehicles: async (userId: string, token: string) => {
    return apiFetch(`/api/vehicles/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },
};

// Payments API functions
export const paymentsApi = {
  getAll: async (token: string) => {
    return apiFetch("/api/payments", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getById: async (id: string, token: string) => {
    return apiFetch(`/api/payments/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  create: async (paymentData: any, token: string) => {
    return apiFetch("/api/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
  },

  update: async (id: string, paymentData: any, token: string) => {
    return apiFetch(`/api/payments/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
  },
};

// Analytics API functions
export const analyticsApi = {
  getDashboardData: async (token: string) => {
    try {
      // Fetch all required data in parallel
      const [occupancyRes, spacesRes, usersRes, bookingsRes, paymentsRes] = await Promise.all([
        apiFetch("/api/analytics/occupancy", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }),
        apiFetch("/api/spaces", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }),
        apiFetch("/api/users", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }),
        apiFetch("/api/bookings", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }),
        apiFetch("/api/payments", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
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
    return apiFetch("/api/analytics/revenue", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getOccupancyData: async (token: string) => {
    return apiFetch("/api/analytics/occupancy", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getUsageData: async (token: string) => {
    return apiFetch("/api/analytics/usage", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getDailyData: async (token: string) => {
    return apiFetch("/api/analytics/daily", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  },

  getMonthlyData: async (token: string) => {
    return apiFetch("/api/analytics/monthly", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
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