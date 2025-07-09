import React, { createContext, useContext, useEffect, useState } from "react";
import { stationManagerAPI } from "../../../api/station_manager";
import { useAuth } from "../../AuthContext";

const StationManagerContext = createContext();

export const useStationManager = () => {
  const context = useContext(StationManagerContext);
  if (!context) {
    throw new Error(
      "useStationManager must be used within StationManagerProvider"
    );
  }
  return context;
};

export const StationManagerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stationProfile, setStationProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("myStation");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse station profile from localStorage", error);
      return null;
    }
  });
  const { user } = useAuth();

  const saveStationProfile = (stationProfile) => {
    setStationProfile(stationProfile);
    localStorage.setItem("myStation", JSON.stringify(stationProfile));
  };

  const unsetStationProfile = () => {
    setStationProfile(null);
    localStorage.removeItem("myStation");
  };

  useEffect(() => {
    fetchStationProfile();
  }, []);

  const fetchStationProfile = async () => {
    setLoading(true);
    setError(null);
    if (!user) return null;

    try {
      const data = await stationAPI.getProfile(user.worker.stationId);
      saveStationProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    error,
    loading,
    stationProfile,

    setError,
    setLoading,
    fetchStationProfile,
  };

  return (
    <StationManagerContext.Provider value={value}>
      {children}
    </StationManagerContext.Provider>
  );
};
