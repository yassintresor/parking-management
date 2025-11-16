import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { spacesApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Navbar from "@/components/Navbar";

interface ParkingSpace {
  id: number;
  space_number: string;
  location: string;
  type: string;
  status: string;
  hourly_rate: string;
  created_at: string;
}

export default function PublicAvailableSpaces() {
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableSpaces();
  }, []);

  const fetchAvailableSpaces = async () => {
    try {
      const response = await spacesApi.getAvailable();
      if (response.success) {
        setSpaces(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch available spaces');
      }
    } catch (error) {
      console.error('Error fetching available spaces:', error);
      toast.error('Error fetching available spaces');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAvailableSpaces();
  };

  const filteredSpaces = spaces.filter(space =>
    space.space_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Available Parking Spaces</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find and book available parking spaces in our facilities. 
            Sign in to reserve your spot!
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search available spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading available parking spaces...</p>
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'No spaces match your search criteria.' : 'No available parking spaces at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">Space {space.space_number}</CardTitle>
                      <CardDescription>{space.location}</CardDescription>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {space.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{space.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly Rate:</span>
                      <span className="font-semibold">{space.hourly_rate} RWF</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate("/auth")}
                  >
                    Sign In to Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        
      </main>
    </div>
  );
}