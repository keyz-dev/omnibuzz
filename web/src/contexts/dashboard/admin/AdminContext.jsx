import React, { createContext, useContext, useState } from 'react';
import { adminAPI } from '../../../api/admin/';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

const AdminProvider = ({ children }) => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Admin-specific data fetching
  const fetchAgencies = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await adminAPI.getAgencies(filters);
      setAgencies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    agencies,
    loading,
    error,
    successMessage,

    // Actions
    fetchAgencies,
    setError,
    setSuccessMessage
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;