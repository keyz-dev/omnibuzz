import api from "../config";

export const busesAPI = {
    // Fetch all buses for the agency
    fetchBuses: async (agencyId, page = 1, filters = {}) => {
        const queryParams = {
            page,
            ...filters,
        };

        // Remove null or undefined filter values
        Object.keys(queryParams).forEach(key => (queryParams[key] == null || queryParams[key] === '') && delete queryParams[key]);

        const response = await api.get(`/bus/by-agency/${agencyId}`, { params: queryParams });
        return response.data;
    },

    // Get a single bus by ID
    getBus: async (busId) => {
        const response = await api.get(`/bus/${busId}`);
        return response.data;
    },

    // Create a new bus
    createBus: async (busData) => {
        const response = await api.post("/bus", busData);
        return response.data;
    },

    // Update an existing bus
    updateBus: async (busId, busData) => {
        const response = await api.put(`/bus/${busId}`, busData);
        return response.data;
    },

    // Delete a bus
    deleteBus: async (busId) => {
        const response = await api.delete(`/bus/${busId}`);
        return response.data;
    },

    // Fetch bus statistics
    fetchBusStats: async (agencyId) => {
        const response = await api.get(`/bus/by-agency/${agencyId}/stats`);
        return response.data;
    },

    // Bulk insert buses
    bulkInsertBuses: async (agencyId, buses) => {
        const response = await api.post(`/bus/bulk-insert/${agencyId}`, buses);
        return response.data;
    },
};