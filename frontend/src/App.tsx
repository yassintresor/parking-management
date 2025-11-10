import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Auth components
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User components
import UserDashboard from "./pages/users/UserDashboard";
import AdminDashboardWithSidebar from "./pages/users/AdminDashboardWithSidebar";
import AdminLogin from "./pages/users/AdminLogin";
import EmployeeDashboard from "./pages/users/EmployeeDashboard";
import TestAdmin from "./pages/users/TestAdmin";

// Spaces components
import SpacesList from "./pages/spaces/SpacesList";
import AvailableSpaces from "./pages/spaces/AvailableSpaces";

// Bookings components
import BookingsList from "./pages/bookings/BookingsList";
import CreateBooking from "./pages/bookings/CreateBooking";

// Vehicles components
import VehiclesList from "./pages/vehicles/VehiclesList";
import AddVehicle from "./pages/vehicles/AddVehicle";

// Payments components
import PaymentsList from "./pages/payments/PaymentsList";
import ProcessPayment from "./pages/payments/ProcessPayment";

// Analytics components
import AnalyticsDashboard from "./pages/analytics/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  // Debug logging
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* Admin login route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected user routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employee" 
                element={
                  <ProtectedRoute requiredRole="employee">
                    <EmployeeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardWithSidebar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test-admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <TestAdmin />
                  </ProtectedRoute>
                } 
              />
              
              {/* Spaces routes */}
              <Route 
                path="/spaces" 
                element={
                  <ProtectedRoute>
                    <SpacesList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/spaces/available" 
                element={<AvailableSpaces />}
              />
              
              {/* Bookings routes */}
              <Route 
                path="/bookings" 
                element={
                  <ProtectedRoute>
                    <BookingsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bookings/new" 
                element={
                  <ProtectedRoute>
                    <CreateBooking />
                  </ProtectedRoute>
                } 
              />
              
              {/* Vehicles routes */}
              <Route 
                path="/vehicles" 
                element={
                  <ProtectedRoute>
                    <VehiclesList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vehicles/new" 
                element={
                  <ProtectedRoute>
                    <AddVehicle />
                  </ProtectedRoute>
                } 
              />
              
              {/* Payments routes */}
              <Route 
                path="/payments" 
                element={
                  <ProtectedRoute>
                    <PaymentsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payments/process" 
                element={
                  <ProtectedRoute>
                    <ProcessPayment />
                  </ProtectedRoute>
                } 
              />
              
              {/* Analytics routes */}
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;