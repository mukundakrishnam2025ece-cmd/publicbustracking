"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { buses } from "@/lib/mock-data";

export type UserRole = "PASSENGER" | "DRIVER" | "GUEST";

export type AuthUser = {
  id: string;
  name: string;
  emailOrPhone: string;
  authMethod?: "GOOGLE" | "OTP_EMAIL" | "OTP_PHONE" | "DRIVER_BADGE";
  role: UserRole;
  badgeNumber?: string;
  assignedBusId?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loginAsPassengerWithGoogle: (googleEmail: string, name: string) => void;
  loginAsPassengerWithOtp: (emailOrPhone: string, name?: string) => void;
  loginAsDriver: (phone: string, badgeNumber: string) => boolean;
  logout: () => void;
  phoneFrameMode: boolean;
  togglePhoneFrameMode: () => void;
  
  // Driver Live Broadcasting Global State
  isBroadcasting: boolean;
  setIsBroadcasting: (broadcasting: boolean) => void;
  selectedBusId: string;
  setSelectedBusId: (busId: string) => void;
  occupancy: "SEATS_AVAILABLE" | "STANDING_ONLY" | "CROWDED";
  setOccupancy: (occ: "SEATS_AVAILABLE" | "STANDING_ONLY" | "CROWDED") => void;
  coords: { lat: number; lng: number; accuracy?: number };
  lastPing: string | null;
  geoError: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);

  // Driver Live State
  const [isBroadcasting, setIsBroadcastingState] = useState<boolean>(false);
  const [selectedBusId, setSelectedBusIdState] = useState<string>(buses[0]?.id || "b_1");
  const [occupancy, setOccupancy] = useState<"SEATS_AVAILABLE" | "STANDING_ONLY" | "CROWDED">("SEATS_AVAILABLE");
  const [lastPing, setLastPing] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number }>({ lat: 11.0168, lng: 76.9558 });
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("tnstc_auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Auth restore error:", e);
      }
    }
    const framePref = localStorage.getItem("tnstc_phone_frame_mode");
    if (framePref !== null) {
      setPhoneFrameMode(framePref === "true");
    }

    const savedBroadcasting = localStorage.getItem("tnstc_driver_broadcasting");
    if (savedBroadcasting === "true") {
      setIsBroadcastingState(true);
    }
    const savedBusId = localStorage.getItem("tnstc_driver_bus_id");
    if (savedBusId) {
      setSelectedBusIdState(savedBusId);
    }
  }, []);

  const setIsBroadcasting = (val: boolean) => {
    setIsBroadcastingState(val);
    localStorage.setItem("tnstc_driver_broadcasting", String(val));
  };

  const setSelectedBusId = (busId: string) => {
    setSelectedBusIdState(busId);
    localStorage.setItem("tnstc_driver_bus_id", busId);
  };

  // Continuous background GPS broadcast loop
  useEffect(() => {
    let watchId: number | null = null;
    let timer: NodeJS.Timeout | null = null;

    if (isBroadcasting) {
      const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];

      const transmitPosition = async (latitude: number, longitude: number, headingDeg: number = 90) => {
        try {
          const res = await fetch("/api/locations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              busId: activeBus.id,
              latitude,
              longitude,
              speedKmh: 38,
              headingDeg,
              occupancy,
            }),
          });
          const data = await res.json();
          if (data.success) {
            setLastPing(new Date().toLocaleTimeString());
          }
        } catch (e) {
          console.error("Global Broadcast transmission failed:", e);
        }
      };

      // 1. Browser Geolocation watch
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude, accuracy, heading } = pos.coords;
            setCoords({ lat: latitude, lng: longitude, accuracy });
            setGeoError(null);
            transmitPosition(latitude, longitude, heading || 90);
          },
          (err) => {
            setGeoError("Using simulated GPS (" + err.message + ")");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
        );
      }

      // 2. Continuous interval heartbeat fallback
      timer = setInterval(() => {
        setCoords((prev) => {
          const nextLat = prev.lat + (Math.random() - 0.5) * 0.0003;
          const nextLng = prev.lng + (Math.random() - 0.5) * 0.0003;
          transmitPosition(nextLat, nextLng);
          return { lat: nextLat, lng: nextLng };
        });
      }, 3500);
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (timer) clearInterval(timer);
    };
  }, [isBroadcasting, selectedBusId, occupancy]);

  const togglePhoneFrameMode = () => {
    setPhoneFrameMode((prev) => {
      const next = !prev;
      localStorage.setItem("tnstc_phone_frame_mode", String(next));
      return next;
    });
  };

  const loginAsPassengerWithGoogle = (googleEmail: string, name: string) => {
    const newUser: AuthUser = {
      id: "u_g_" + Date.now(),
      name: name || googleEmail.split("@")[0],
      emailOrPhone: googleEmail,
      authMethod: "GOOGLE",
      role: "PASSENGER",
    };
    setUser(newUser);
    localStorage.setItem("tnstc_auth_user", JSON.stringify(newUser));
  };

  const loginAsPassengerWithOtp = (emailOrPhone: string, name?: string) => {
    const isEmail = emailOrPhone.includes("@");
    const newUser: AuthUser = {
      id: "u_otp_" + Date.now(),
      name: name || (isEmail ? emailOrPhone.split("@")[0] : `User ${emailOrPhone.slice(-4)}`),
      emailOrPhone: emailOrPhone,
      authMethod: isEmail ? "OTP_EMAIL" : "OTP_PHONE",
      role: "PASSENGER",
    };
    setUser(newUser);
    localStorage.setItem("tnstc_auth_user", JSON.stringify(newUser));
  };

  const loginAsDriver = (phone: string, badgeNumber: string) => {
    const newDriver: AuthUser = {
      id: "d_" + Date.now(),
      name: `Driver (${badgeNumber})`,
      emailOrPhone: phone,
      authMethod: "DRIVER_BADGE",
      role: "DRIVER",
      badgeNumber,
      assignedBusId: "b_1",
    };
    setUser(newDriver);
    localStorage.setItem("tnstc_auth_user", JSON.stringify(newDriver));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsBroadcasting(false);
    localStorage.removeItem("tnstc_auth_user");
    localStorage.removeItem("tnstc_driver_broadcasting");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginAsPassengerWithGoogle,
        loginAsPassengerWithOtp,
        loginAsDriver,
        logout,
        phoneFrameMode,
        togglePhoneFrameMode,
        isBroadcasting,
        setIsBroadcasting,
        selectedBusId,
        setSelectedBusId,
        occupancy,
        setOccupancy,
        coords,
        lastPing,
        geoError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
