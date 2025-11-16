import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, MapPin, Car } from "lucide-react";
import heroImage from "@/assets/parking-hero.jpg";

const Home = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const services = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Real-Time Updates",
      description: "Live availability updates for all parking locations"
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Easy Navigation",
      description: "Find parking spots with detailed addresses and directions"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Parking",
      description: "24/7 monitored and secured parking facilities"
    }
  ];

  // If user is logged in, redirect them to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "OPERATOR") {
        navigate("/employee");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  // If user is logged in, show a message instead of the homepage content
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Already Logged In</h2>
            <p className="text-muted-foreground mb-6">
              You are currently logged in and cannot access the homepage. 
              Please logout first if you want to view the homepage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => {
                if (user.role === "ADMIN") {
                  navigate("/admin");
                } else if (user.role === "OPERATOR") {
                  navigate("/employee");
                } else {
                  navigate("/dashboard");
                }
              }}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={async () => {
                // Use the proper signOut function from the auth hook
                await signOut();
              }}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-hero text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60" />
        <div className="container mx-auto px-4 mt-16 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl text-white md:text-5xl font-bold mb-4 drop-shadow-lg">
            Find Your Perfect Parking Spot
          </h1>
          <p className="text-base sm:text-lg text-white md:text-xl mb-6 sm:mb-8 opacity-95 max-w-2xl mx-auto drop-shadow-md">
            Smart parking management system with real-time availability tracking
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/spaces/available/public")}
          >
            <Car className="h-5 w-5 mr-2" />
            View Available Spaces
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 rounded-lg border bg-gradient-card hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-3 sm:mb-4">{service.icon}</div>
                <h3 className="font-semibold text-lg sm:text-xl mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Spaces Preview */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Available Parking Spaces</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
              Check our real-time availability of parking spaces. Sign in to book your spot!
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border text-center">
            <Car className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">View Current Availability</h3>
            <p className="text-muted-foreground mb-6">
              See which parking spaces are available right now in our facilities
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/spaces/available/public")}
            >
              View Available Spaces
            </Button>
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">About ParkEase</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base">
              ParkEase is a comprehensive parking management solution designed to simplify the process of finding and booking parking spaces. 
              Our system provides real-time availability tracking, seamless booking experiences, and efficient space management for both users and administrators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To eliminate the stress of finding parking by providing an intuitive, real-time parking management platform 
                that connects users with available spaces efficiently and affordably.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="text-muted-foreground list-disc pl-5 space-y-2">
                <li>Real-time parking space availability</li>
                <li>Easy online booking system</li>
                <li>Secure payment processing</li>
                <li>Admin dashboard for space management</li>
                <li>Mobile-responsive design</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Whether you're a daily commuter, occasional visitor, or business owner managing multiple parking facilities, 
              ParkEase provides the tools you need to optimize your parking experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;