import React, { createContext, useContext, useState, useEffect } from 'react';
import { stationAPI } from '../../../api/stationManagerAPI';

const StationManagerContext = createContext();

export const useStationManager = () => {
  const context = useContext(StationManagerContext);
  if (!context) {
    throw new Error('useStationManager must be used within StationManagerProvider');
  }
  return context;
};

export const StationManagerProvider = ({ children }) => {
  const [stationInfo, setStationInfo] = useState(null);
  const [localBookings, setLocalBookings] = useState([]);
  const [departureBuses, setDepartureBuses] = useState([]);
  const [arrivalBuses, setArrivalBuses] = useState([]);
  const [dailySchedules, setDailySchedules] = useState([]);
  const [stationStats, setStationStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Station-specific data fetching
  const fetchStationInfo = async () => {
    setLoading(true);
    try {
      const info = await stationAPI.getStationInfo();
      setStationInfo(info);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalBookings = async (date = new Date()) => {
    setLoading(true);
    try {
      const data = await stationAPI.getLocalBookings(date);
      setLocalBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusMovements = async (date = new Date()) => {
    try {
      const departures = await stationAPI.getDepartures(date);
      const arrivals = await stationAPI.getArrivals(date);
      setDepartureBuses(departures);
      setArrivalBuses(arrivals);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateBusStatus = async (busId, status) => {
    try {
      await stationAPI.updateBusStatus(busId, status);
      // Update local state based on status change
      fetchBusMovements();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDailySchedules = async (date = new Date()) => {
    try {
      const schedules = await stationAPI.getDailySchedules(date);
      setDailySchedules(schedules);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    // State
    stationInfo,
    localBookings,
    departureBuses,
    arrivalBuses,
    dailySchedules,
    stationStats,
    loading,
    error,
    
    // Actions
    fetchStationInfo,
    fetchLocalBookings,
    fetchBusMovements,
    updateBusStatus,
    fetchDailySchedules,
    setError
  };

  return (
    <StationManagerContext.Provider value={value}>
      {children}
    </StationManagerContext.Provider>
  );
};