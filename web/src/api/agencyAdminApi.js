import api from "./config";
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

  // Bookings management
  getBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/bookings?${params}`);
    return response.data;
  },

  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.patch(`/bookings/${bookingId}/status`, {
      status,
    });
    return response.data;
  },

  // Bus management
  getBuses: async () => {
    const response = await api.get("/buses");
    return response.data;
  },

  getBus: async (busId) => {
    const response = await api.get(`/buses/${busId}`);
    return response.data;
  },

  addBus: async (busData) => {
    const response = await api.post("/buses", busData);
    return response.data;
  },

  updateBus: async (busId, busData) => {
    const response = await api.put(`/buses/${busId}`, busData);
    return response.data;
  },

  deleteBus: async (busId) => {
    const response = await api.delete(`/buses/${busId}`);
    return response.data;
  },

  // Routes management
  getRoutes: async () => {
    const response = await api.get("/routes");
    return response.data;
  },

  getRoute: async (routeId) => {
    const response = await api.get(`/routes/${routeId}`);
    return response.data;
  },

  addRoute: async (routeData) => {
    const response = await api.post("/routes", routeData);
    return response.data;
  },

  updateRoute: async (routeId, routeData) => {
    const response = await api.put(`/routes/${routeId}`, routeData);
    return response.data;
  },

  deleteRoute: async (routeId) => {
    const response = await api.delete(`/routes/${routeId}`);
    return response.data;
  },

  // Staff management
  getStaff: async () => {
    const response = await api.get("/staff");
    return response.data;
  },

  getStaffMember: async (staffId) => {
    const response = await api.get(`/staff/${staffId}`);
    return response.data;
  },

  addStaff: async (staffData) => {
    const response = await api.post("/staff", staffData);
    return response.data;
  },

  updateStaff: async (staffId, staffData) => {
    const response = await api.put(`/staff/${staffId}`, staffData);
    return response.data;
  },

  deleteStaff: async (staffId) => {
    const response = await api.delete(`/staff/${staffId}`);
    return response.data;
  },

  // Stations management
  getStations: async () => {
    const response = await api.get("/stations");
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

  // Schedules
  getSchedules: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/schedules?${params}`);
    return response.data;
  },

  createSchedule: async (scheduleData) => {
    const response = await api.post("/schedules", scheduleData);
    return response.data;
  },

  updateSchedule: async (scheduleId, scheduleData) => {
    const response = await api.put(`/schedules/${scheduleId}`, scheduleData);
    return response.data;
  },

  deleteSchedule: async (scheduleId) => {
    const response = await api.delete(`/schedules/${scheduleId}`);
    return response.data;
  },
};
