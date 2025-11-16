// SpaceList.tsx - Example component demonstrating API usage
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { spacesApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ParkingSpace {
  id: string;
  name: string;
  location: string;
  is_occupied: boolean;
  hourly_rate: number;
}

const SpaceList = () => {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await spacesApi.getAll(token);
      setSpaces(response.data || []);
    } catch (err) {
      setError('Failed to fetch parking spaces');
      toast.error('Failed to fetch parking spaces');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpace = async (id: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    try {
      await spacesApi.delete(id, token);
      toast.success('Parking space deleted successfully');
      fetchSpaces(); // Refresh the list
    } catch (err) {
      toast.error('Failed to delete parking space');
    }
  };

  if (loading) {
    return <div className="p-4">Loading parking spaces...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Parking Spaces</CardTitle>
          <CardDescription>Manage all parking spaces in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {spaces.length === 0 ? (
            <p>No parking spaces found.</p>
          ) : (
            <div className="space-y-4">
              {spaces.map((space) => (
                <div key={space.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <h3 className="font-semibold">{space.name}</h3>
                    <p className="text-sm text-gray-500">{space.location}</p>
                    <p className="text-sm">
                      Rate: RWF {space.hourly_rate}/hour - 
                      {space.is_occupied ? ' Occupied' : ' Available'}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteSpace(space.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaceList;