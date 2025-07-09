import api from '../'
const routePrefix = '/station'

export const stationManagerAPI = {
    getProfile: async (stationId) => {
        try {
            const response = await api.get(`${routePrefix}/${stationId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching station profile:", error);
            throw error;
        }
    }
}