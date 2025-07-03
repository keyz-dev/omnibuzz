import api from "../";

export const routesAPI = {
  getAll: async (agencyId, { page = 1, limit = 10, ...filters } = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters }).toString();
    const response = await api.get(`/route/by-agency/${agencyId}?${params}`);
    return response.data.data;
  },

  getStats: async (agencyId) => {
    const response = await api.get(`/route/by-agency/${agencyId}/stats`);
    return response.data.data;
  },

  create: async (agencyId, routeData) => {
    const response = await api.post(`/route/by-agency/${agencyId}`, routeData);
    return response.data.data;
  },

  update: async (routeId, routeData) => {
    const response = await api.put(`/route/${routeId}`, routeData);
    return response.data.data;
  },

  delete: async (routeId) => {
    await api.delete(`/route/${routeId}`);
  },
};
