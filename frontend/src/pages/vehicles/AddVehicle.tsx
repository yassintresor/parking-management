import React, { useState } from 'react';
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

export default function AddVehicle() {
  const [formData, setFormData] = useState({
    license_plate: '',
    make: '',
    model: '',
    color: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.license_plate || !formData.make || !formData.model) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Submit vehicle to backend
      const response = await vehiclesApi.create(formData, token);
      
      if (response.success) {
        toast.success('Vehicle added successfully!');
        navigate('/vehicles');
      } else {
        setError(response.message || 'Failed to add vehicle');
        toast.error(response.message || 'Failed to add vehicle');
      }
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      setError(error.message || 'Failed to add vehicle');
      toast.error(error.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
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
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/vehicles")}
                      isActive={true}
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
            <div className="font-semibold">Add New Vehicle</div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="container mx-auto py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Add New Vehicle</h1>
                <p className="text-gray-600">Register a new vehicle for parking bookings</p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                  <CardDescription>Enter the details of your vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="license_plate">License Plate *</Label>
                      <Input
                        id="license_plate"
                        name="license_plate"
                        placeholder="ABC123"
                        value={formData.license_plate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="make">Make *</Label>
                        <Input
                          id="make"
                          name="make"
                          placeholder="Toyota"
                          value={formData.make}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        <Input
                          id="model"
                          name="model"
                          placeholder="Camry"
                          value={formData.model}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        name="color"
                        placeholder="Blue"
                        value={formData.color}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <Button variant="outline" onClick={() => navigate('/vehicles')}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Vehicle'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}