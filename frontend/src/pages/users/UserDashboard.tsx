import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { spacesApi, bookingsApi, vehiclesApi } from '@/services/api';
import { toast } from 'sonner';
import { 
  Home, 
  Car, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut,
  Plus,
  User,
  MapPin
} from 'lucide-react';

interface Vehicle {
  id: number;
  license_plate: string;
  make: string;
  model: string;
}

interface ParkingSpace {
  id: number;
  space_number: string;
  location: string;
  type: string;
  status: string;
  hourly_rate: string;
}

const UserDashboard = () => {
  console.log("UserDashboard component rendering");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for active section
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // Booking form state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [availableSpacesCount, setAvailableSpacesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    space_id: '',
    vehicle_id: '',
    start_time: '',
    end_time: ''
  });
  const [error, setError] = useState('');
  
  // Load user vehicles and available spaces on component mount
  useEffect(() => {
    if (user) {
      fetchVehiclesAndSpaces();
      fetchAvailableSpacesCount();
    }
  }, [user]);
  
  // Update active section based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/bookings')) {
      setActiveSection('bookings');
    } else if (path.includes('/vehicles')) {
      setActiveSection('vehicles');
    } else if (path.includes('/payments')) {
      setActiveSection('payments');
    } else {
      setActiveSection('dashboard');
    }
  }, [location]);
  
  const fetchVehiclesAndSpaces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token || !user) {
        throw new Error('Authentication required');
      }
      
      // Fetch user's vehicles
      const vehiclesResponse = await vehiclesApi.getUserVehicles(user.id.toString(), token);
      if (vehiclesResponse.success) {
        setVehicles(vehiclesResponse.data);
      }
      
      // Fetch available parking spaces
      const spacesResponse = await spacesApi.getAvailable();
      if (spacesResponse.success) {
        setSpaces(spacesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load vehicles or parking spaces');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAvailableSpacesCount = async () => {
    try {
      const response = await spacesApi.getAvailableCount();
      if (response.success) {
        setAvailableSpacesCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching available spaces count:', error);
    }
  };
  
  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.space_id || !formData.vehicle_id || !formData.start_time || !formData.end_time) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await bookingsApi.create(formData, token);
      
      if (response.success) {
        toast.success('Booking created successfully!');
        // Reset form
        setFormData({
          space_id: '',
          vehicle_id: '',
          start_time: '',
          end_time: ''
        });
        // Refresh data
        fetchVehiclesAndSpaces();
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">User Dashboard</h1>
          <p className="text-neutral-600 text-lg">Welcome back, {user?.name || user?.email} 👋</p>
          {availableSpacesCount > 0 && (
            <div className="mt-3 inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
              ✅ {availableSpacesCount} parking spaces currently available
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="modern-card border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium mb-2">Available Spaces</p>
                <p className="text-4xl font-bold text-blue-600">{availableSpacesCount}</p>
                <p className="text-xs text-neutral-500 mt-3">Ready to book</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="modern-card border-l-4 border-l-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium mb-2">Total Vehicles</p>
                <p className="text-4xl font-bold text-green-600">{vehicles.length}</p>
                <p className="text-xs text-neutral-500 mt-3">Registered</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-xl">
                <Car className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="modern-card border-l-4 border-l-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium mb-2">Quick Access</p>
                <p className="text-lg font-semibold text-neutral-900 mt-2">View & Manage</p>
                <p className="text-xs text-neutral-500 mt-3">All features</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form - Spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="modern-card border border-blue-200">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">📅 Request New Booking</h2>
                <p className="text-neutral-600 text-sm mt-1">Reserve a parking space for your vehicle</p>
              </div>
              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                    <span className="text-lg mt-0.5">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="space_id" className="text-sm font-semibold text-neutral-700">🅿️ Select Parking Space</Label>
                    <Select 
                      value={formData.space_id} 
                      onValueChange={(value) => handleChange('space_id', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="input-modern bg-white border-2 border-gray-200 hover:border-blue-300">
                        <SelectValue placeholder="Choose a parking space..." />
                      </SelectTrigger>
                      <SelectContent>
                        {spaces.map((space) => (
                          <SelectItem key={space.id} value={space.id.toString()}>
                            <span className="flex items-center gap-2">
                              <span className={`inline-block w-2 h-2 rounded-full ${space.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              Space {space.space_number} - {space.location} (RWF {space.hourly_rate}/hr)
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="vehicle_id" className="text-sm font-semibold text-neutral-700">🚗 Select Vehicle</Label>
                    <Select 
                      value={formData.vehicle_id} 
                      onValueChange={(value) => handleChange('vehicle_id', value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="input-modern bg-white border-2 border-gray-200 hover:border-blue-300">
                        <SelectValue placeholder="Choose your vehicle..." />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                            {vehicle.license_plate} - {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="start_time" className="text-sm font-semibold text-neutral-700">⏱️ Start Time</Label>
                      <Input
                        type="datetime-local"
                        id="start_time"
                        value={formData.start_time}
                        onChange={(e) => handleChange('start_time', e.target.value)}
                        disabled={loading}
                        className="input-modern bg-white border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="end_time" className="text-sm font-semibold text-neutral-700">⏱️ End Time</Label>
                      <Input
                        type="datetime-local"
                        id="end_time"
                        value={formData.end_time}
                        onChange={(e) => handleChange('end_time', e.target.value)}
                        disabled={loading}
                        className="input-modern bg-white border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/bookings')}
                      disabled={loading}
                      className="border-2 border-gray-300 hover:bg-gray-100"
                    >
                      View All Bookings
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg font-semibold"
                    >
                      {loading ? '⏳ Creating...' : '✅ Create Booking'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="modern-card border border-purple-200 h-full">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-xl font-bold text-neutral-900">⚡ Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg font-semibold py-6 text-base"
                  onClick={() => navigate('/bookings')}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  My Bookings
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg font-semibold py-6 text-base"
                  onClick={() => navigate('/vehicles')}
                >
                  <Car className="h-5 w-5 mr-2" />
                  My Vehicles
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg font-semibold py-6 text-base"
                  onClick={() => navigate('/spaces/available')}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Find Parking
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:shadow-lg font-semibold py-6 text-base"
                  onClick={() => navigate('/payments')}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payments
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "bookings":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">📅 My Bookings</h1>
                <p className="text-neutral-600 mt-2">View and manage your parking reservations</p>
              </div>
              <div className="modern-card p-12 text-center border-2 border-dashed border-blue-200">
                <Calendar className="h-16 w-16 mx-auto text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No bookings yet</h3>
                <p className="text-neutral-600 mb-6 text-lg">You haven't made any parking bookings yet. Start by creating your first booking!</p>
                <Button 
                  onClick={() => setActiveSection("dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Booking
                </Button>
              </div>
            </div>
          </div>
        );
      case "vehicles":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">🚗 My Vehicles</h1>
                <p className="text-neutral-600 mt-2">Manage your registered vehicles</p>
              </div>
              <div className="modern-card p-12 text-center border-2 border-dashed border-green-200">
                <Car className="h-16 w-16 mx-auto text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No vehicles registered</h3>
                <p className="text-neutral-600 mb-6 text-lg">Add your vehicles to start making parking bookings.</p>
                <Button 
                  onClick={() => navigate('/vehicles/new')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Vehicle
                </Button>
              </div>
            </div>
          </div>
        );
      case "payments":
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">💳 Payment History</h1>
                <p className="text-neutral-600 mt-2">View your payment transactions and invoices</p>
              </div>
              <div className="modern-card p-12 text-center border-2 border-dashed border-amber-200">
                <CreditCard className="h-16 w-16 mx-auto text-amber-400 mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">No payments yet</h3>
                <p className="text-neutral-600 text-lg">You haven't made any payments yet. Create a booking to proceed with payment.</p>
              </div>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Sidebar className="bg-gradient-to-b from-blue-900 to-purple-900 text-white shadow-2xl">
          <SidebarHeader className="border-b border-blue-700/50 bg-gradient-to-r from-blue-800/80 to-purple-800/80 backdrop-blur-sm p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="text-white hover:bg-white/10 rounded-xl transition-all duration-300 p-4">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col gap-1 leading-none">
                      <span className="font-bold text-white text-lg">{user?.name || 'User'}</span>
                      <span className="text-xs text-blue-200">{user?.email}</span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          
          <SidebarContent className="py-6">
            <SidebarGroup>
              <SidebarGroupLabel className="text-blue-300 font-bold text-sm mb-3 px-4">NAVIGATION</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2 px-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("dashboard");
                        navigate("/dashboard");
                      }}
                      isActive={activeSection === "dashboard"}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "dashboard" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("bookings");
                        navigate("/bookings");
                      }}
                      isActive={activeSection === "bookings"}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "bookings" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="font-medium">My Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("vehicles");
                        navigate("/vehicles");
                      }}
                      isActive={activeSection === "vehicles"}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "vehicles" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <Car className="h-5 w-5" />
                      <span className="font-medium">My Vehicles</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("payments");
                        navigate("/payments");
                      }}
                      className={`rounded-xl transition-all duration-300 p-4 ${
                        activeSection === "payments" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span className="font-medium">Payments</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-blue-700/50 bg-gradient-to-r from-red-700/80 to-orange-700/80 backdrop-blur-sm p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => signOut()}
                  className="text-blue-100 hover:bg-red-500/30 hover:text-white rounded-xl font-medium transition-all duration-300 p-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 md:px-8 shadow-sm">
            <SidebarTrigger className="-ml-1 hover:bg-gray-100 rounded-lg transition-colors" />
            <div className="font-bold text-lg capitalize text-neutral-900 ml-2">
              {activeSection === "dashboard" ? "📊 User Dashboard" : 
               activeSection === "bookings" ? "📅 My Bookings" :
               activeSection === "vehicles" ? "🚗 My Vehicles" :
               activeSection === "payments" ? "💳 Payment History" : "Dashboard"}
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;