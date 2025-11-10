import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';

interface OccupancyData {
  type: string;
  total_spaces: number;
  available_spaces: string;
  occupied_spaces: string;
  reserved_spaces: string;
  occupancy_rate: string;
}

interface RevenueData {
  date: string;
  total_revenue: string;
  total_payments: number;
}

export default function AnalyticsDashboard() {
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // In a real implementation, these would call your backend APIs
      // const occupancyResponse = await fetch('/api/analytics/occupancy');
      // const occupancyData = await occupancyResponse.json();
      // setOccupancyData(occupancyData);
      
      // const revenueResponse = await fetch('/api/analytics/revenue');
      // const revenueData = await revenueResponse.json();
      // setRevenueData(revenueData);
      
      // Mock data for now
      setOccupancyData([
        {
          type: 'COMPACT',
          total_spaces: 10,
          available_spaces: '5',
          occupied_spaces: '3',
          reserved_spaces: '2',
          occupancy_rate: '50.00'
        },
        {
          type: 'LARGE',
          total_spaces: 5,
          available_spaces: '2',
          occupied_spaces: '2',
          reserved_spaces: '1',
          occupancy_rate: '60.00'
        }
      ]);
      
      setRevenueData([
        {
          date: '2025-11-05',
          total_revenue: '150.00',
          total_payments: 5
        },
        {
          date: '2025-11-04',
          total_revenue: '120.00',
          total_payments: 4
        }
      ]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (userRole !== 'admin' && userRole !== 'employee') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-500">Access Denied</h1>
          <p className="text-gray-500">You don't have permission to view analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">View parking system analytics and reports</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Occupancy Overview</h2>
              <Button variant="outline" onClick={fetchAnalyticsData}>
                Refresh Data
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {occupancyData.map((data, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{data.type} Spaces</CardTitle>
                    <CardDescription>Total: {data.total_spaces} spaces</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Available:</span>
                        <span>{data.available_spaces}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Occupied:</span>
                        <span>{data.occupied_spaces}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Reserved:</span>
                        <span>{data.reserved_spaces}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Occupancy Rate:</span>
                          <span className="font-bold">{data.occupancy_rate}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Revenue Trends</h2>
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{formatDate(data.date)}</div>
                        <div className="text-sm text-gray-500">{data.total_payments} payments</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">RWF {data.total_revenue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}