import api from "..";
const API_BASE_URL = "/api/admin";

export const agencyAPI = {
  // Profile management
  getProfile: async () => {
    const response = await api.get("/agency/me");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/profile", profileData);
    return response.data;
  },

  publishAgency: async (agencyId) => {
    const response = await api.put(`/agency/${agencyId}/publish`);
    return response.data;
  },

  // Revenue and analytics
  getRevenue: async (period = "month") => {
    const response = await api.get(`/revenue?period=${period}`);
    return response.data;
  },

  getAnalytics: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/analytics?${params}`);
    return response.data;
  },
};
