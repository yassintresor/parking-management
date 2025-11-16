import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Car, 
  Calendar, 
  CreditCard, 
  LogOut,
  Plus
} from 'lucide-react';
import { spacesApi, vehiclesApi, bookingsApi } from '@/services/api';
import { toast } from 'sonner';

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

export default function CreateBooking() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    space_id: '',
    vehicle_id: '',
    start_time: '',
    end_time: ''
  });
  const [error, setError] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehiclesAndSpaces();
  }, []);

  const fetchVehiclesAndSpaces = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Fetch user's vehicles
      const vehiclesResponse = await vehiclesApi.getUserVehicles(user?.id || '', token);
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
      setError('Failed to load data');
    } finally {
      setLoading(false);
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
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Submit booking to backend
      const response = await bookingsApi.create(formData, token);
      
      if (response.success) {
        toast.success('Booking created successfully!');
        navigate('/bookings');
      } else {
        setError(response.message || 'Failed to create booking');
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking');
      toast.error(error.message || 'Failed to create booking');
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
                      onClick={() => navigate("/dashboard")}
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/bookings")}
                      isActive={true}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/vehicles")}
                    >
                      <Car className="h-4 w-4" />
                      <span>My Vehicles</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/payments")}
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
            <div className="font-semibold">Create New Booking</div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="container mx-auto py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Booking</h1>
                <p className="text-gray-600">Reserve a parking space for your vehicle</p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Fill in the details to reserve your parking space</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="space_id">Parking Space</Label>
                        <Select onValueChange={(value) => handleChange('space_id', value)} value={formData.space_id}>
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
                        <Select onValueChange={(value) => handleChange('vehicle_id', value)} value={formData.vehicle_id}>
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
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="end_time">End Time</Label>
                          <Input
                            type="datetime-local"
                            id="end_time"
                            value={formData.end_time}
                            onChange={(e) => handleChange('end_time', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="outline" onClick={() => navigate('/bookings')}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Create Booking
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}