import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car } from "lucide-react";

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: number;
}

interface ParkingSpotCardProps {
  spot: ParkingSpot;
}

const ParkingSpotCard = ({ spot }: ParkingSpotCardProps) => {
  const isAvailable = spot.availableSpots > 0;
  const occupancyRate = ((spot.totalSpots - spot.availableSpots) / spot.totalSpots) * 100;

  return (
    <Card className="modern-card border-0 h-full hover:border-blue-200 group cursor-pointer">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-neutral-900 group-hover:text-blue-600 transition-colors">{spot.name}</h3>
          </div>
          <Badge 
            className={`${isAvailable ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gradient-to-r from-red-500 to-rose-600 text-white"} shadow-lg`}
          >
            {isAvailable ? "Available" : "Full"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium">{spot.address}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Car className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-neutral-900">
              {spot.availableSpots}/{spot.totalSpots}
            </span>
            <span className="text-sm text-neutral-600">spots</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-600 mb-1">Price</div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${spot.pricePerHour}
            </span>
            <span className="text-xs text-neutral-600">/hr</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Occupancy</span>
            <span className={`text-sm font-bold ${
              occupancyRate > 80 ? "text-red-600" : 
              occupancyRate > 50 ? "text-amber-600" : "text-green-600"
            }`}>
              {occupancyRate.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                occupancyRate > 80 ? "bg-gradient-to-r from-red-500 to-rose-600" : 
                occupancyRate > 50 ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gradient-to-r from-green-500 to-emerald-600"
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingSpotCard;