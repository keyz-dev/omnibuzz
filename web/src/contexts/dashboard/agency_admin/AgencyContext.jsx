import React, { createContext, useContext, useState, useEffect } from 'react';
import { agencyAPI } from '../../../api/agency_admin';

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
    revenue,
    loading,
    error,
    successMessage,
    isPublishable,
    publishStatus,

    // Actions
    fetchAgencyProfile,
    fetchRevenue,
    setError,
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
