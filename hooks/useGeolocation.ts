import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

/**
 * Hook to automatically detect and store user's current location
 * Uses browser geolocation with IP fallback
 */
export function useGeolocation() {
  const setLocation = useStore((state) => state.setLocation);
  const currentLat = useStore((state) => state.lat);
  const currentLon = useStore((state) => state.lon);
  const attemptedRef = useRef(false);

  // Try to get location from IP if geolocation fails
  const getLocationFromIP = async (): Promise<boolean> => {
    try {
      const response = await fetch("https://ipapi.co/json/", {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (!response.ok) {
        throw new Error("IP location lookup failed");
      }

      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        console.log("Got location from IP:", { latitude: data.latitude, longitude: data.longitude });
        setLocation(data.latitude.toString(), data.longitude.toString());
        return true;
      } else {
        console.error("IP location missing coordinates");
        return false;
      }
    } catch (error) {
      console.error("IP location fallback error:", error);
      return false;
    }
  };

  useEffect(() => {
    // Skip if location already set
    if (currentLat && currentLon) {
      console.log("Location already set:", { lat: currentLat, lon: currentLon });
      return;
    }

    // Skip if we've already attempted this session
    if (attemptedRef.current) {
      return;
    }

    attemptedRef.current = true;

    // Check if geolocation is supported by browser
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported, attempting IP-based location");
      getLocationFromIP();
      return;
    }

    // Request user's location from browser
    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      console.log("Browser geolocation success:", { latitude, longitude });
      setLocation(latitude.toString(), longitude.toString());
    };

    const errorCallback = async (error: GeolocationPositionError) => {
      const errorMessages: { [key: number]: string } = {
        1: "Location permission denied. Please enable location access in browser settings.",
        2: "Location information is unavailable. Please try again.",
        3: "Location request timed out. Please retry.",
      };
      
      const message = errorMessages[error.code] || error.message || "Unknown geolocation error";
      console.warn(`Geolocation error [${error.code}]: ${message}`);

      // Try IP-based fallback
      const ipSuccess = await getLocationFromIP();
      
      if (!ipSuccess) {
        console.error("Both geolocation and IP location failed");
      }
    };

    // Options for geolocation - optimized for faster response
    const options = {
      enableHighAccuracy: false, // Faster, less battery
      timeout: 8000, // 8 seconds timeout
      maximumAge: 600000, // Use cached location for 10 minutes
    };

    console.log("Requesting browser geolocation...");
    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options
    );
  }, [currentLat, currentLon, setLocation]);
}
