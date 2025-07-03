import api from "../";

const routePrefix = "schedule/station-manager/";

export const schedulesAPI = {
    // Fetch all schedules for the station manager's agency
    fetchSchedules: async (filters = {}) => {
        try {
            const response = await api.get(`${routePrefix}`, { params: filters });
            return response.data;
        } catch (error) {
            console.error("Error fetching schedules:", error);
            throw error;
        }
    },

    // Create a new schedule
    createSchedule: async (scheduleData) => {
        try {
            const response = await api.post(`${routePrefix}`, scheduleData);
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

    // Delete a schedule
    deleteSchedule: async (scheduleId) => {
        try {
            const response = await api.delete(`${routePrefix}/${scheduleId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting schedule:", error);
            throw error;
        }
    },

    // To populate the routes dropdown in the schedule creation form
    fetchRoutes: async () => {
        try {
            // Assuming a general routes endpoint exists
            const response = await api.get("/routes");
            return response.data;
        } catch (error) {
            console.error("Error fetching routes:", error);
            throw error;
        }
    },
};
