import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../../../api/adminAPI';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [agencies, setAgencies] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchDocuments = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await adminAPI.getDocuments(filters);
      setDocuments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveDocument = async (documentId) => {
    try {
      await adminAPI.approveDocument(documentId);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'approved' }
            : doc
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectDocument = async (documentId, reason) => {
    try {
      await adminAPI.rejectDocument(documentId, reason);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'rejected', rejectionReason: reason }
            : doc
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSystemStats = async () => {
    try {
      const stats = await adminAPI.getSystemStats();
      setSystemStats(stats);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    // State
    agencies,
    documents,
    systemStats,
    pendingApprovals,
    loading,
    error,
    
    // Actions
    fetchAgencies,
    fetchDocuments,
    approveDocument,
    rejectDocument,
    fetchSystemStats,
    setError
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};