import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, MapPin } from "lucide-react";
import heroImage from "@/assets/parking-hero.jpg";

const Home = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Find Your Perfect Parking Spot
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-95 max-w-2xl mx-auto drop-shadow-md">
            Smart parking management system with real-time availability tracking
          </p>
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