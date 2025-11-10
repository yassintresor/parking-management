import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../hooks/useAuth';

interface Booking {
  id: number;
  space_id: number;
  space_number: string;
  start_time: string;
  end_time: string;
  // Add other booking properties as needed
}

export default function ProcessPayment() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    method: 'CARD',
    card_number: '',
    expiry_date: '',
    cvv: ''
  });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // In a real implementation, you would get the booking ID from the URL or state
    // and fetch the booking details from your backend API
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      // Mock data for now
      setBooking({
        id: 1,
        space_id: 1,
        space_number: 'A1',
        start_time: '2025-11-05T10:00:00.000Z',
        end_time: '2025-11-05T12:00:00.000Z'
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Failed to load booking details');
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
    
    if (!formData.method) {
      setError('Please select a payment method');
      return;
    }
    
    if (formData.method === 'CARD' && (!formData.card_number || !formData.expiry_date || !formData.cvv)) {
      setError('Please fill in all card details');
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real implementation, this would call your backend API
      // const response = await fetch('/api/payments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     booking_id: booking?.id,
      //     amount: calculateAmount(), // You would calculate this based on booking duration and space rate
      //     currency: 'RWF',
      //     method: formData.method
      //   })
      // });
      
      // if (response.ok) {
      //   navigate('/payments');
      // } else {
      //   setError('Payment failed');
      // }
      
      // For now, just navigate to payments
      console.log('Payment data:', {
        booking_id: booking?.id,
        method: formData.method,
        card_number: formData.card_number
      });
      navigate('/payments');
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const calculateAmount = () => {
    // In a real implementation, you would calculate the amount based on:
    // - Booking duration (end_time - start_time)
    // - Space hourly rate
    // - Any applicable pricing rules
    return '5.00'; // Mock amount
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Process Payment</h1>
        <p className="text-gray-600">Complete your payment for parking booking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select 
                    value={formData.method} 
                    onValueChange={(value) => handleChange('method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CARD">Credit/Debit Card</SelectItem>
                      <SelectItem value="MOBILE_WALLET">Mobile Wallet</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.method === 'CARD' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="card_number">Card Number</Label>
                      <Input
                        id="card_number"
                        placeholder="1234 5678 9012 3456"
                        value={formData.card_number}
                        onChange={(e) => handleChange('card_number', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry_date">Expiry Date</Label>
                        <Input
                          id="expiry_date"
                          placeholder="MM/YY"
                          value={formData.expiry_date}
                          onChange={(e) => handleChange('expiry_date', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleChange('cvv', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button variant="outline" onClick={() => navigate('/bookings')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
              <CardDescription>Details of your parking booking</CardDescription>
            </CardHeader>
            <CardContent>
              {booking && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Space:</span>
                    <span className="font-medium">Space {booking.space_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Time:</span>
                    <span>{formatDateTime(booking.start_time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">End Time:</span>
                    <span>{formatDateTime(booking.end_time)}</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="font-bold text-lg">RWF {calculateAmount()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}