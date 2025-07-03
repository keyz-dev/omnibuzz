import React, { createContext, useContext, useState } from "react";
import { adminDocAPI } from "../../../api/admin/documents";

const AdminContext = createContext();

export const useAdminDocuments = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminDocuments must be used within AdminProvider");
  }
  return context;
};

const AdminDocumentsProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [documentStats, setDocumentStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data when first needed
  const initializeDocuments = async () => {
    if (!isInitialized) {
      await Promise.all([fetchDocuments(), fetchDocumentStats()]);
      setIsInitialized(true);
    }
  };

  const fetchDocuments = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await adminDocAPI.getDocuments(filters);
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
      const data = await adminDocAPI.getDocumentStats();
      setDocumentStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveDocument = async (documentId) => {
    try {
      await adminDocAPI.approveDocument(documentId);
      setSuccessMessage("Document approved successfully");
      await fetchDocuments();
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectDocument = async (documentId, reason) => {
    setLoading(true);
    try {
      await adminDocAPI.rejectDocument(documentId, reason);
      setSuccessMessage("Document rejected successfully");
      await fetchDocuments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addRemark = async (documentId, remark) => {
    try {
      setLoading(true);
      const updatedDoc = await adminDocAPI.addRemark(documentId, remark);
      if (updatedDoc.success) {
        setSuccessMessage(updatedDoc.message);
        await fetchDocuments();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    documents,
    documentStats,
    loading,
    error,
    successMessage,
    isInitialized,

    // Actions
    fetchDocuments,
    fetchDocumentStats,
    approveDocument,
    rejectDocument,
    addRemark,
    setError,
    setSuccessMessage,
    initializeDocuments
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminDocumentsProvider;
