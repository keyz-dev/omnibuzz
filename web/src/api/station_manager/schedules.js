import api from "../";

const routePrefix = "/schedule";

export const schedulesAPI = {
    // Fetch all schedules for the station manager's agency
    fetchSchedules: async (stationId, filters = {}) => {
        try {
            const response = await api.get(routePrefix + `/by-station/${stationId}`, { params: filters });
            return response.data;
        } catch (error) {
            console.error("Error fetching schedules:", error);
            throw error;
        }
    },

    // Create a new schedule
    createSchedule: async (scheduleData) => {
        try {
            const response = await api.post(routePrefix, scheduleData);
            return response.data;
        } catch (error) {
            console.error("Error creating schedule:", error);
            throw error;
        }
    },

    // Update an existing schedule
    updateSchedule: async (scheduleId, scheduleData) => {
        try {
            const response = await api.put(`${routePrefix}/${scheduleId}`, scheduleData);
            return response.data;
        } catch (error) {
            console.error("Error updating schedule:", error);
            throw error;
        }
    },

    // Delete an existing schedule
    deleteSchedule: async (scheduleId) => {
        try {
            const response = await api.delete(`${routePrefix}/${scheduleId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting schedule:", error);
            throw error;
        }
    },

    // Fetch routes for the dropdown
    fetchRoutes: async (stationId) => {
        try {
            const response = await api.get(`/route/by-station/${stationId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching routes:", error);
            throw error;
        }
    }
};
