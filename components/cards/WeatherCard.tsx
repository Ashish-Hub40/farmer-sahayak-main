"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Cloud, Droplets, Wind, MapPin, Volume2, Loader2, RefreshCw } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getWeather } from "@/actions/weather";
import { speakNative } from "@/lib/audio";
import { getLanguageByCode } from "@/lib/languages";

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  location: string;
}

export default function WeatherCard() {
  const { t, i18n } = useTranslation();
  const lat = useStore((state) => state.lat);
  const lon = useStore((state) => state.lon);
  const currentLanguage = useStore((state) => state.currentLanguage);
  const setLocation = useStore((state) => state.setLocation);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string>("");
  const language = getLanguageByCode(currentLanguage);

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const getGeoErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null) {
      const geoError = error as GeolocationPositionError;
      if (geoError.message) return geoError.message;
      switch (geoError.code) {
        case 1:
          return "Location permission denied. Please enable location access in browser settings.";
        case 2:
          return "Location information is unavailable. Please try again.";
        case 3:
          return "Location request timed out. Please retry.";
      }
    }
    return "Unable to access location. Please check your browser settings and try again.";
  };

  const setLocationFromIp = useCallback(async () => {
    try {
      const response = await fetch("https://ipapi.co/json/", {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (!response.ok) {
        throw new Error("IP location lookup failed");
      }

      const data = await response.json();
      if (!data.latitude || !data.longitude) {
        throw new Error("Could not determine location from IP");
      }

      setLocation(data.latitude.toString(), data.longitude.toString());
      return true;
    } catch (error) {
      console.error("Location fallback error:", error);
      return false;
    }
  }, [setLocation]);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setLocationError("");

    let hasLocation = false;

    // First, try browser geolocation
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      try {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation(position.coords.latitude.toString(), position.coords.longitude.toString());
              hasLocation = true;
              console.log("Location obtained from browser");
              resolve();
            },
            (error) => {
              const errorMsg = getGeoErrorMessage(error);
              console.warn(`Browser geolocation error [${error.code}]: ${error.message}`, errorMsg);
              reject(new Error(errorMsg));
            },
            {
              enableHighAccuracy: false,
              timeout: 8000,
              maximumAge: 600000,
            }
          );
        });
      } catch (err) {
        console.error("Browser geolocation failed, trying IP fallback:", err instanceof Error ? err.message : String(err));
      }
    } else {
      console.warn("Geolocation not supported");
    }

    // If browser geolocation failed, try IP-based location
    if (!hasLocation) {
      try {
        const success = await setLocationFromIp();
        if (success) {
          hasLocation = true;
          console.log("Location obtained from IP");
        }
      } catch (err) {
        console.error("IP location fallback failed:", err instanceof Error ? err.message : String(err));
      }
    }

    // If both methods failed, show error
    if (!hasLocation) {
      setLocationError(
        "Could not determine your location. Please ensure location services are enabled and try again."
      );
    }

    setLoading(false);
  }, [setLocation, setLocationFromIp]);

  const fetchWeather = useCallback(async () => {
    if (!lat || !lon) return;
    setLoading(true);
    try {
      const langCode = currentLanguage?.split("-")[0] || "en";
      const result = await getWeather(lat, lon, langCode);
      if (result.success && result.data) {
        setWeather(result.data);
        setLocationError(""); // Clear any previous errors
      } else {
        console.error("Weather fetch failed:", result);
        const errorMsg = result.error || "Unable to fetch weather. Please try again.";
        setLocationError(errorMsg);
        setWeather(null);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
      setLocationError(errorMsg);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [lat, lon, currentLanguage]);

  useEffect(() => {
    // Fetch weather whenever location changes
    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon, fetchWeather]);

  useEffect(() => {
    // Request location on mount if not already set
    if (!lat || !lon) {
      console.log("No location set, requesting location on mount...");
      requestLocation();
    }
  }, []); // Run only once on mount

  useEffect(() => {
    // Request location if it becomes null
    if (!lat || !lon) {
      console.log("Location cleared, requesting new location...");
      requestLocation();
    }
  }, [lat, lon, requestLocation]);

  const handleSpeak = () => {
    if (!weather) return;
    const humidityLabel = t('humidity') || 'Humidity';
    const tempUnit = t('temperature') || 'Temperature';
    const text = `${t('weather')}: ${weather.description}, ${weather.temperature} degrees, ${humidityLabel} ${weather.humidity} percent`;
    speakNative(text, language?.browserCode || "en-IN");
  };

  if (loading) {
    return (
      <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/40 p-8 h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0.4) 100%)' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3 text-blue-700" />
          <p className="text-lg font-medium text-gray-800">{t('loadingWeather')}</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <>
        <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/40 p-8 h-48 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.4) 0%, rgba(249, 115, 22, 0.4) 100%)' }}>
          <div className="flex items-center gap-4">
            <MapPin className="w-12 h-12 text-orange-700" />
            <div>
              <p className="text-2xl font-bold mb-1 text-gray-900">{t('locationNeeded')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={requestLocation}
            className="bg-white/60 text-orange-700 px-8 py-4 rounded-2xl font-bold hover:bg-white/80 hover:shadow-lg transition-all border border-white/40"
          >
            {t('enableLocation')}
          </button>
        </div>
        {locationError ? (
          <p className="mt-3 text-sm text-red-700">{locationError}</p>
        ) : null}
      </>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/40 p-8 h-48 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0.4) 50%, rgba(99, 102, 241, 0.4) 100%)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <Cloud className="w-32 h-32 absolute -top-8 -right-8 text-blue-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between">
        {/* Left: Location and Temperature */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-blue-700" />
            <p className="text-xl font-semibold text-gray-900">{weather.location}</p>
          </div>
          
          <div className="flex items-baseline gap-3 mb-4">
            <div className="text-6xl font-bold text-gray-900">{weather.temperature}°C</div>
            <div className="text-lg text-gray-800 capitalize">{weather.description}</div>
          </div>
          
          {/* Weather Details */}
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">{weather.windSpeed} m/s</span>
            </div>
          </div>
        </div>

        {/* Right: Weather Icon and Controls */}
        <div className="flex flex-col items-end gap-4">
          <div className="text-7xl">
            {weather.description.includes('rain') ? '🌧️' : 
             weather.description.includes('cloud') ? '☁️' : 
             weather.description.includes('clear') ? '☀️' : '🌤️'}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSpeak}
              className="p-3 bg-white/40 hover:bg-white/60 rounded-2xl transition-all backdrop-blur-sm border border-white/40 text-blue-700"
              title={t('listen')}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={fetchWeather}
              className="p-3 bg-white/40 hover:bg-white/60 rounded-2xl transition-all backdrop-blur-sm border border-white/40 text-blue-700"
              title={t('refresh')}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}