import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../hooks/useAuth';

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
  const { user } = useAuth();

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
  );
}