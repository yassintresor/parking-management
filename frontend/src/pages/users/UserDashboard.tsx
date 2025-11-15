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
  User
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
    <div className="space-y-6 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user?.email}</p>
        {availableSpacesCount > 0 && (
          <p className="text-sm text-green-600 mt-1">
            {availableSpacesCount} parking spaces currently available
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Request New Booking</CardTitle>
            <CardDescription>Reserve a parking space for your vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="space_id">Parking Space</Label>
                <Select 
                  value={formData.space_id} 
                  onValueChange={(value) => handleChange('space_id', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parking space" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={space.id.toString()}>
                        Space {space.space_number} - {space.location} (${space.hourly_rate}/hr)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle_id">Vehicle</Label>
                <Select 
                  value={formData.vehicle_id} 
                  onValueChange={(value) => handleChange('vehicle_id', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
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
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    type="datetime-local"
                    id="start_time"
                    value={formData.start_time}
                    onChange={(e) => handleChange('start_time', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    type="datetime-local"
                    id="end_time"
                    value={formData.end_time}
                    onChange={(e) => handleChange('end_time', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/bookings')}
                  disabled={loading}
                >
                  View All Bookings
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* User Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => navigate('/bookings')}
              >
                View My Bookings
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/vehicles')}
              >
                Manage My Vehicles
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/spaces/available')}
              >
                View Available Spaces
              </Button>
            </CardContent>
          </Card>
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
          <div className="p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your parking bookings</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't made any parking bookings yet.</p>
                  <Button onClick={() => setActiveSection("dashboard")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "vehicles":
        return (
          <div className="p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">My Vehicles</h1>
              <p className="text-muted-foreground">Manage your registered vehicles</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No vehicles registered</h3>
                  <p className="text-muted-foreground mb-4">You haven't registered any vehicles yet.</p>
                  <Button onClick={() => navigate('/vehicles/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "payments":
        return (
          <div className="p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Payment History</h1>
              <p className="text-muted-foreground">View your payment transactions</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
                  <p className="text-muted-foreground">You haven't made any payments yet.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex flex-col gap-1 leading-none">
                    <span className="font-semibold">Parking User</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                    {user?.name && (
                      <span className="text-xs text-muted-foreground">{user.name}</span>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("dashboard");
                        navigate("/dashboard");
                      }}
                      isActive={activeSection === "dashboard"}
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("bookings");
                        navigate("/bookings");
                      }}
                      isActive={activeSection === "bookings"}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("vehicles");
                        navigate("/vehicles");
                      }}
                      isActive={activeSection === "vehicles"}
                    >
                      <Car className="h-4 w-4" />
                      <span>My Vehicles</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => {
                        setActiveSection("payments");
                        navigate("/payments");
                      }}
                      isActive={activeSection === "payments"}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Payments</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="font-semibold capitalize">
              {activeSection === "dashboard" ? "User Dashboard" : 
               activeSection === "bookings" ? "My Bookings" :
               activeSection === "vehicles" ? "My Vehicles" :
               activeSection === "payments" ? "Payment History" : "Dashboard"}
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