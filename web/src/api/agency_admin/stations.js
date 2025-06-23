import api from "../config";

export const stationsAPI = {
    // Fetch all stations for the agency
    fetchStations: async (agencyId, page = 1, limit = 10, filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/station/by-agency/${agencyId}?page=${page}&limit=${limit}&${params}`);
        return response.data;
    },

    // Get a single station by ID
    getStation: async (stationId) => {
        const response = await api.get(`/station/${stationId}`);
        return response.data;
    },

    // Create a new station
    createStation: async (stationData) => {
        const response = await api.post("/station", stationData);
        return response.data;
    },

    // Update an existing station
    updateStation: async (stationId, stationData) => {
        const response = await api.put(`/station/${stationId}`, stationData);
        return response.data;
    },

    // Delete a station
    deleteStation: async (stationId) => {
        const response = await api.delete(`/station/${stationId}`);
        return response.data;
    },
}