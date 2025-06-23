import api from "../config";

const routePrefix = '/staff'

export const staffAPI = {
    getAll: async (agencyId, { page = 1, limit = 10, ...filters } = {}) => {
        const params = new URLSearchParams({ page, limit, ...filters }).toString();
        const response = await api.get(`${routePrefix}/by-agency/${agencyId}?${params}`);
        return response.data;
    },

    getStats: async (agencyId) => {
        const response = await api.get(`${routePrefix}/by-agency/${agencyId}/stats`);
        return response.data;
    },

    create: async (staffData) => {
        const response = await api.post(`${routePrefix}`, staffData);
        return response.data;
    },

    update: async (workerId, staffData) => {
        const response = await api.put(`${routePrefix}/${workerId}`, staffData);
        return response.data;
    },

    delete: async (workerId) => {
        await api.delete(`${routePrefix}/${workerId}`);
    },

    resendInvite: async (workerId) => {
        const response = await api.post(`${routePrefix}/${workerId}/resend-invite`);
        return response.data;
    },
};
