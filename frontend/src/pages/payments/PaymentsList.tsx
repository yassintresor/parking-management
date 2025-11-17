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
  LogOut
} from 'lucide-react';

interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  amount: string;
  currency: string;
  method: string;
  status: string;
  created_at: string;
  space_id: number;
}

export default function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // In a real implementation, this would call your backend API
      // const response = await fetch('/api/payments/user/' + user?.id);
      // const data = await response.json();
      // setPayments(data);
      
      // Mock data for now
      setPayments([
        {
          id: 1,
          booking_id: 1,
          user_id: 1,
          amount: '5.00',
          currency: 'RWF',
          method: 'CARD',
          status: 'PENDING',
          created_at: '2025-11-05T11:06:13.000Z',
          space_id: 1
        }
      ]);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.amount.includes(searchTerm)
  );

  const handleRefundPayment = (paymentId: number) => {
    console.log('Refunding payment:', paymentId);
    // In a real implementation, this would call your backend API
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: string, currency: string) => {
    return `${currency} ${amount}`;
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
                      className="text-blue-100 hover:bg-white/10 rounded-xl transition-all duration-300 p-4"
                    >
                      <Car className="h-5 w-5" />
                      <span>My Vehicles</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate("/payments")}
                      isActive={true}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg transition-all duration-300 p-4"
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
            <div className="font-semibold text-lg">Payment History</div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="container mx-auto py-8">
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold">Payment History</h1>
                    <p className="text-gray-600">View your payment records</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payments found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPayments.map((payment) => (
                    <Card key={payment.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">Payment #{payment.id}</CardTitle>
                            <CardDescription>Booking #{payment.booking_id}</CardDescription>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'PAID' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'PENDING' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : payment.status === 'REFUNDED' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Amount:</span>
                            <span className="font-medium">{formatAmount(payment.amount, payment.currency)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Method:</span>
                            <span>{payment.method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Date:</span>
                            <span>{formatDateTime(payment.created_at)}</span>
                          </div>
                          <div className="pt-4 flex space-x-2">
                            {payment.status === 'PAID' && (
                              <Button variant="outline" size="sm" onClick={() => handleRefundPayment(payment.id)}>
                                Request Refund
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => console.log('View details', payment.id)}>
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