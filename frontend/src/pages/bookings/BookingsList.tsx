import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../hooks/useAuth';

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
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // In a real implementation, this would call your backend API
      // const response = await fetch('/api/bookings');
      // const data = await response.json();
      // setBookings(data);
      
      // Mock data for now
      setBookings([
        {
          id: 1,
          user_id: 1,
          space_id: 1,
          vehicle_id: 1,
          start_time: '2025-11-05T10:00:00.000Z',
          end_time: '2025-11-05T12:00:00.000Z',
          status: 'ACTIVE',
          created_at: '2025-11-05T11:05:38.000Z',
          space_number: 'A1',
          license_plate: 'ABC123'
        }
      ]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.space_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancelBooking = (bookingId: number) => {
    console.log('Canceling booking:', bookingId);
    // In a real implementation, this would call your backend API
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-gray-600">View and manage your parking bookings</p>
          </div>
          <Button onClick={() => console.log('Create new booking')}>
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
          <Button className="mt-4" onClick={() => console.log('Create new booking')}>
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
  );
}