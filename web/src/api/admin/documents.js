import api from "..";
/**
 * Admin Document Management API
 * This module provides functions to manage documents in the admin dashboard.
 * It includes fetching, approving, rejecting, and adding remarks to documents.
 */

export const adminDocAPI = {
  // Document management
  getDocuments: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/document?${params}`);
    return response.data;
  },

  getDocument: async (documentId) => {
    const response = await api.get(`/document/${documentId}`);
    return response.data;
  },

  getDocumentStats: async () => {
    const response = await api.get(`/document/stats`);
    return response.data;
  },

  approveDocument: async (documentId) => {
    const response = await api.patch(`/document/${documentId}/approve`);
    return response.data;
  },

  rejectDocument: async (documentId, reason) => {
    const response = await api.patch(`/document/${documentId}/reject`, {
      reason,
    });
    return response.data;
  },

  addRemark: async (documentId, remark) => {
    const response = await api.patch(`/document/${documentId}/remark`, {
      remark,
    });
    return response.data;
  },
};
