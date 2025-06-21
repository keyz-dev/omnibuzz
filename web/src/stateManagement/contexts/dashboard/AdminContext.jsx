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
  const [documentStats, setDocumentStats] = useState({});
  const [pendingApprovals, setPendingApprovals] = useState([]);
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

  const fetchDocuments = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await adminAPI.getDocuments(filters);
      setDocuments(data.documents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentStats = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getDocumentStats();
      setDocumentStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveDocument = async (documentId) => {
    try {
      await adminAPI.approveDocument(documentId);
      setSuccessMessage("Document approved successfully");
      await fetchDocuments();
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectDocument = async (documentId, reason) => {
    setLoading(true);
    try {
      await adminAPI.rejectDocument(documentId, reason);
      setSuccessMessage("Document rejected successfully");
      await fetchDocuments();
    } catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const addRemark = async (documentId, remark) => {
    try {
      setLoading(true);
      const updatedDoc = await adminAPI.addRemark(documentId, remark);
      if (updatedDoc.success) {
        setSuccessMessage(updatedDoc.message);
        await fetchDocuments();
      }
    } catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const stats = await adminAPI.getSystemStats();
      setSystemStats(stats);
    } catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    agencies,
    documents,
    documentStats,
    pendingApprovals,
    loading,
    error,
    successMessage,

    // Actions
    fetchAgencies,
    fetchDocuments,
    fetchDocumentStats,
    approveDocument,
    rejectDocument,
    addRemark,
    fetchSystemStats,
    setError,
    setSuccessMessage
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};