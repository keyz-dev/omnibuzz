import React, { createContext, useContext, useState, useEffect } from 'react';
import {agencyAPI} from '../../../api/agencyAdminApi';

const AgencyAdminContext = createContext();

export const useAgency = () => {
  const context = useContext(AgencyAdminContext);
  if (!context) {
    throw new Error('useAgency must be used within AgencyProvider');
  }
  return context;
};

export const AgencyProvider = ({ children }) => {
  const [agencyProfile, setAgencyProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("myAgency");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse agency profile from localStorage", error);
      return null;
    }
  });
  const [bookings, setBookings] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [staff, setStaff] = useState([]);
  const [stations, setStations] = useState([]);
  const [revenue, setRevenue] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveAgencyProfile = async (agency) => {
    setAgencyProfile(agency);
    localStorage.setItem("myAgency", JSON.stringify(agency));
  };

  const unsetAgencyProfile = () => {
    setAgencyProfile(null);
    localStorage.removeItem("myAgency");
  };

  useEffect(()=>{
    fetchAgencyProfile()
  }, [])

  // Agency-specific data fetching
  const fetchAgencyProfile = async () => {
    setLoading(true);
    try {
      const profile = await agencyAPI.getProfile();
      if (profile.success){
        saveAgencyProfile(profile.data);
      } else{
        unsetAgencyProfile()
      }
    } catch (err) {
      unsetAgencyProfile()
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    setLoading(true);
    const agencyId = agencyProfile.agency.id
    try {
      const response = await agencyAPI.getStations(agencyId);
      if (response.success) {
        setStations(response.data);
      } else {
        setStations([]);
        setError(response.message || 'Failed to fetch stations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await agencyAPI.getBookings(filters);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const data = await agencyAPI.getBuses();
      setBuses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const addBus = async (busData) => {
    try {
      const newBus = await agencyAPI.addBus(busData);
      setBuses(prev => [...prev, newBus]);
      return newBus;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateBus = async (busId, busData) => {
    try {
      const updatedBus = await agencyAPI.updateBus(busId, busData);
      setBuses(prev => 
        prev.map(bus => bus.id === busId ? updatedBus : bus)
      );
      return updatedBus;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchRoutes = async () => {
    try {
      const data = await agencyAPI.getRoutes();
      setRoutes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await agencyAPI.getStaff();
      setStaff(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const addStaffMember = async (staffData) => {
    try {
      const newStaff = await agencyAPI.addStaff(staffData);
      setStaff(prev => [...prev, newStaff]);
      return newStaff;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchRevenue = async (period = 'month') => {
    try {
      const data = await agencyAPI.getRevenue(period);
      setRevenue(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    // State
    agencyProfile,
    bookings,
    buses,
    routes,
    staff,
    stations,
    revenue,
    loading,
    error,
    
    // Actions
    fetchAgencyProfile,
    fetchStations,
    fetchBookings,
    fetchBuses,
    addBus,
    updateBus,
    fetchRoutes,
    fetchStaff,
    addStaffMember,
    fetchRevenue,
    setError
  };

  return (
    <AgencyAdminContext.Provider value={value}>
      {children}
    </AgencyAdminContext.Provider>
  );
};
