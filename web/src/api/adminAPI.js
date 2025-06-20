import api from "./config";
const API_BASE_URL = "/api/admin";

export const adminAPI = {
  // Agency management
  getAgencies: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/agency?${params}`);
    return response.data;
  },

  getAgency: async (agencyId) => {
    const response = await api.get(`/agency/${agencyId}`);
    return response.data;
  },

  createAgency: async (agencyData) => {
    const response = await api.post("/agency", agencyData);
    return response.data;
  },

  updateAgency: async (agencyId, agencyData) => {
    const response = await api.put(`/agency/${agencyId}`, agencyData);
    return response.data;
  },

  deleteAgency: async (agencyId) => {
    const response = await api.delete(`/agency/${agencyId}`);
    return response.data;
  },

  approveAgency: async (agencyId) => {
    const response = await api.patch(`/agency/${agencyId}/approve`);
    return response.data;
  },

  suspendAgency: async (agencyId, reason) => {
    const response = await api.patch(`/agency/${agencyId}/suspend`, {
      reason,
    });
    return response.data;
  },

  // Document management
  getDocuments: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/documents?${params}`);
    return response.data;
  },

  getDocument: async (documentId) => {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  },

  approveDocument: async (documentId) => {
    const response = await api.patch(`/documents/${documentId}/approve`);
    return response.data;
  },

  rejectDocument: async (documentId, reason) => {
    const response = await api.patch(`/documents/${documentId}/reject`, {
      reason,
    });
    return response.data;
  },

  // System statistics
  getSystemStats: async () => {
    const response = await api.get("/stats");
    return response.data;
  },

  // Pending approvals
  getPendingApprovals: async () => {
    const response = await api.get("/pending-approvals");
    return response.data;
  },

  // User management
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  suspendUser: async (userId, reason) => {
    const response = await api.patch(`/users/${userId}/suspend`, {
      reason,
    });
    return response.data;
  },

  // Reports
  generateReport: async (reportType, filters = {}) => {
    const response = await api.post("/reports/generate", {
      reportType,
      filters,
    });
    return response.data;
  },
};
