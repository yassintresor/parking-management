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
import { vehiclesApi } from '@/services/api';
import { toast } from 'sonner';

interface Vehicle {
  id: number;
  user_id: number;
  license_plate: string;
  make: string;
  model: string;
  color: string;
  created_at: string;
}

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Fetch user's vehicles from backend
      const response = await vehiclesApi.getUserVehicles(user?.id || '', token);
      
      if (response.success) {
        setVehicles(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteVehicle = async (vehicleId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // In a real implementation, this would call your backend API to delete the vehicle
      // For now, we'll just show a message
      toast.info('Vehicle deletion would be implemented here');
      
      // Refresh the vehicles list
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="bg-gradient-to-b from-blue-900 to-purple-900 text-white shadow-2xl">
          <SidebarHeader className="border-b border-blue-700/50 bg-gradient-to-r from-blue-800/80 to-purple-800/80 backdrop-blur-sm p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="text-white hover:bg-white/10 rounded-xl transition-all duration-300 p-4">
                  <div className="flex flex-col gap-1 leading-none">
                    <span className="font-bold text-white text-lg">Parking User</span>
                    <span className="text-xs text-blue-200">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          
          <SidebarContent className="py-6">
            <SidebarGroup>
              <SidebarGroupLabel className="text-blue-300 font-bold text-sm mb-3 px-4">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2 px-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/dashboard")}
                      className="text-blue-100 hover:bg-white/10 rounded-xl transition-all duration-300 p-4"
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/bookings")}
                      className="text-blue-100 hover:bg-white/10 rounded-xl transition-all duration-300 p-4"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>My Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/vehicles")}
                      isActive={true}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg transition-all duration-300 p-4"
                    >
                      <Car className="h-5 w-5" />
                      <span>My Vehicles</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/payments")}
                      className="text-blue-100 hover:bg-white/10 rounded-xl transition-all duration-300 p-4"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Payments</span>
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
                  className="text-blue-100 hover:bg-red-500/30 hover:text-white rounded-xl transition-all duration-300 p-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm">
            <SidebarTrigger className="-ml-1 hover:bg-gray-100 rounded-lg transition-colors" />
            <div className="font-semibold text-lg">My Vehicles</div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="container mx-auto py-8">
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold">My Vehicles</h1>
                    <p className="text-gray-600">Manage your registered vehicles</p>
                  </div>
                  <Button onClick={() => navigate("/vehicles/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : filteredVehicles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No vehicles found.</p>
                  <Button className="mt-4" onClick={() => navigate("/vehicles/new")}>
                    Add Your First Vehicle
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <Card key={vehicle.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{vehicle.license_plate}</CardTitle>
                            <CardDescription>{vehicle.make} {vehicle.model}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Color:</span>
                            <span>{vehicle.color}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Added:</span>
                            <span>{formatDate(vehicle.created_at)}</span>
                          </div>
                          <div className="pt-4 flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => console.log('Edit vehicle', vehicle.id)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteVehicle(vehicle.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}