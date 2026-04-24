// src/context/LocationContext.jsx
import { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({ city: "Kolkata", lat: 22.5726, lng: 88.3639 });

  const cities = [
    { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { city: "Delhi", lat: 28.7041, lng: 77.1025 },
    { city: "Patna", lat: 25.5941, lng: 85.1376 },
    { city: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { city: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { city: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { city: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { city: "Chennai", lat: 13.0827, lng: 80.2707 },
    { city: "Bhopal", lat: 23.2599, lng: 77.4126 },
    { city: "Ranchi", lat: 23.3441, lng: 85.3096 },
    { city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { city: "Chandigarh", lat: 30.7333, lng: 76.7794 }
  ];

  return (
    <LocationContext.Provider value={{ location, setLocation, cities }}>
      {children}
    </LocationContext.Provider>
  );
};