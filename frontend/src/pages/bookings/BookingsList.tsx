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
import { bookingsApi } from '@/services/api';
import { toast } from 'sonner';

interface Booking {
  id: number;
  user_id: number;
  space_id: number;
  vehicle_id: number;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  space_number: string;
  license_plate: string;
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Fetch user's bookings from backend
      const response = await bookingsApi.getUserBookings(user?.id.toString() || '', token);
      
      if (response.success) {
        setBookings(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.space_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await bookingsApi.cancel(bookingId.toString(), token);
      
      if (response.success) {
        toast.success('Booking cancelled successfully');
        // Refresh the bookings list
        fetchBookings();
      } else {
        toast.error(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
            <div className="font-semibold">My Bookings</div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="container mx-auto py-8">
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                    <p className="text-gray-600">View and manage your parking bookings</p>
                  </div>
                  <Button onClick={() => navigate("/bookings/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Booking
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings found.</p>
                  <Button className="mt-4" onClick={() => navigate("/bookings/new")}>
                    Create Your First Booking
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">Booking #{booking.id}</CardTitle>
                            <CardDescription>Space {booking.space_number}</CardDescription>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'ACTIVE' 
                              ? 'bg-blue-100 text-blue-800' 
                              : booking.status === 'CANCELLED' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Vehicle:</span>
                            <span>{booking.license_plate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Start Time:</span>
                            <span>{formatDateTime(booking.start_time)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">End Time:</span>
                            <span>{formatDateTime(booking.end_time)}</span>
                          </div>
                          <div className="pt-4 flex space-x-2">
                            {booking.status === 'ACTIVE' && (
                              <Button variant="outline" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                                Cancel
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => console.log('View details', booking.id)}>
                              View Details
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