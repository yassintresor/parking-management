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

  // Fallback for hero image
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    // Show a fallback element
    const parent = target.parentElement;
    if (parent) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'bg-gradient-to-br from-blue-200 to-purple-200 w-full h-full flex items-center justify-center';
      fallbackDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="M14 11v4.8a1.5 1.5 0 0 0 3 0V11"></path><path d="M19 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path><path d="M22 13v1a1 1 0 0 1-1 1h-1"></path><path d="M22 17v1a1 1 0 0 1-1 1h-1"></path><path d="M2 13v1a1 1 0 0 0 1 1h1"></path><path d="M2 17v1a1 1 0 0 0 1 1h1"></path><path d="M14 11V6a1 1 0 0 0-1-1H5a2 2 0 0 0-2 2v8.14a2 2 0 0 0 .88 1.66l.6.42a2 2 0 0 1 .88.78l.46.88a2 2 0 0 0 1.78 1.08H13a2 2 0 0 0 2-2V11h-1z"></path></svg>';
      parent.appendChild(fallbackDiv);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-[450px] md:h-[500px] text-primary-foreground overflow-hidden">
        {/* Background Image */}
        <img 
          src={heroImage} 
          alt="Modern parking facility" 
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/75 to-purple-900/70" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4 drop-shadow-lg max-w-4xl leading-tight">
            Find Your Perfect Parking Spot
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-6 sm:mb-8 max-w-3xl leading-relaxed">
            Smart parking management system with real-time availability tracking, seamless booking, and secure payment processing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
              onClick={() => navigate("/spaces/available/public")}
            >
              <Car className="h-5 w-5 mr-2" />
              View Available Spaces
            </Button>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold border border-white/20"
              onClick={() => navigate("/auth/register")}
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Floating Elements for visual interest */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-white relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-neutral-900">Our Services</h2>
          <p className="text-center text-neutral-600 mb-8 sm:mb-12 max-w-2xl mx-auto">Comprehensive parking solutions tailored to your needs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="modern-card group cursor-pointer hover:border-blue-200"
              >
                <div className="mb-4 inline-block p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-all">{service.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-neutral-900">{service.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Spaces Preview with Image Grid */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-neutral-900">Available Parking Spaces</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto text-sm sm:text-base">
              Check our real-time availability of parking spaces. Sign in to book your spot!
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Left: Visual Element */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={heroImage}
                alt="Parking availability overview"
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-bold text-sm">Real-time Parking Status</p>
                <p className="text-xs opacity-90">Live updates across all facilities</p>
              </div>
            </div>

            {/* Right: Content */}
            <div className="modern-card border-2 border-dashed border-blue-200 text-center lg:text-left">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                <Car className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-neutral-900">View Current Availability</h3>
              <p className="text-neutral-600 mb-6 leading-relaxed">
                See which parking spaces are available right now in our facilities. Get instant access to real-time parking information and book your preferred spot instantly.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold text-sm">✓</span>
                  <span className="text-neutral-700">Real-time availability updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold text-sm">✓</span>
                  <span className="text-neutral-700">Multiple parking locations</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold text-sm">✓</span>
                  <span className="text-neutral-700">Instant booking confirmation</span>
                </div>
              </div>
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg mt-6 font-semibold"
                onClick={() => navigate("/spaces/available/public")}
              >
                <Car className="h-5 w-5 mr-2" />
                View Available Spaces
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-purple-100 to-blue-100 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-neutral-900">About ParkEase</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto text-sm sm:text-base">
              ParkEase is a comprehensive parking management solution designed to simplify the process of finding and booking parking spaces. 
              Our system provides real-time availability tracking, seamless booking experiences, and efficient space management for both users and administrators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="modern-card border-l-4 border-l-blue-600">
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Our Mission</h3>
              <p className="text-neutral-600 leading-relaxed">
                To eliminate the stress of finding parking by providing an intuitive, real-time parking management platform 
                that connects users with available spaces efficiently and affordably.
              </p>
            </div>
            
            <div className="modern-card border-l-4 border-l-purple-600">
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Key Features</h3>
              <ul className="text-neutral-600 space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                  <span>Real-time parking space availability</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                  <span>Easy online booking system</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                  <span>Admin dashboard for space management</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                  <span>Mobile-responsive design</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-neutral-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
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