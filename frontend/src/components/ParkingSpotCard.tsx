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
    <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-card border-border h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{spot.name}</h3>
          <Badge 
            variant={isAvailable ? "default" : "secondary"}
            className={isAvailable ? "bg-success" : ""}
          >
            {isAvailable ? "Available" : "Full"}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{spot.address}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {spot.availableSpots} / {spot.totalSpots} spots
            </span>
          </div>
          <span className="text-accent font-bold text-lg">
            ${spot.pricePerHour}/hr
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Occupancy</span>
            <span>{occupancyRate.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                occupancyRate > 80 ? "bg-destructive" : 
                occupancyRate > 50 ? "bg-accent" : "bg-success"
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