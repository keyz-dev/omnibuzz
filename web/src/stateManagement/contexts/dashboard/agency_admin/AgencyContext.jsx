import React, { createContext, useContext, useState, useEffect } from 'react';
import { agencyAPI } from '../../../../api/agencyAdminApi';

const AgencyAdminContext = createContext();

export const useAgency = () => {
  const context = useContext(AgencyAdminContext);
  if (!context) {
    throw new Error('useAgency must be used within AgencyProvider');
  }
  return context;
};

const AgencyProvider = ({ children }) => {
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
  const [staff, setStaff] = useState([]);
  const [stations, setStations] = useState([]);
  const [revenue, setRevenue] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isPublishable, setIsPublishable] = useState(false);
  const [publishStatus, setPublishStatus] = useState(false);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage('');
  };

  const saveAgencyProfile = async (agency) => {
    setAgencyProfile(agency);
    setIsPublishable(agency.isPublishable);
    localStorage.setItem("myAgency", JSON.stringify(agency));
  };

  const unsetAgencyProfile = () => {
    setAgencyProfile(null);
    localStorage.removeItem("myAgency");
  };

  useEffect(() => {
    fetchAgencyProfile()
  }, [])

  // Agency-specific data fetching
  const fetchAgencyProfile = async () => {
    setLoading(true);
    try {
      const profile = await agencyAPI.getProfile();
      if (profile.success) {
        saveAgencyProfile(profile.data);
        setIsPublishable(profile.data.isPublishable);
        setPublishStatus(profile.data.agency.isPublished);
      } else {
        unsetAgencyProfile()
      }
    } catch (err) {
      unsetAgencyProfile()
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const publishAgency = async (id) => {
    setLoading(true);
    try {
      const response = await agencyAPI.publishAgency(id);
      if (response.success) {
        setPublishStatus(true);
      } else {
        setError(response.message || 'Failed to publish agency');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

  const saveDocuments = async (documents) => {
    setLoading(true);
    setError(null);
    try {
      const response = await agencyAPI.uploadDocuments(documents, agencyProfile.agency.id);
      await fetchAgencyProfile();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload documents.');
      throw err;
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
    staff,
    stations,
    revenue,
    loading,
    error,
    successMessage,
    isPublishable,
    publishStatus,

    // Actions
    fetchAgencyProfile,
    fetchStations,
    fetchBookings,
    fetchStaff,
    addStaffMember,
    fetchRevenue,
    setError,
    saveDocuments,
    publishAgency,
    setIsPublishable,
    setPublishStatus,
    clearMessages
  };

  return (
    <AgencyAdminContext.Provider value={value}>
      {children}
    </AgencyAdminContext.Provider>
  );
};

export default AgencyProvider;
