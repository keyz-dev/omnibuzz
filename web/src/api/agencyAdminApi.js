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

  publishAgency: async (agencyId) => {
    const response = await api.put(`/agency/${agencyId}/publish`);
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
  getBuses: async (agencyId, page = 1, filters = {}) => {
    const queryParams = {
      page,
      ...filters,
    };

    // Remove null or undefined filter values
    Object.keys(queryParams).forEach(key => (queryParams[key] == null || queryParams[key] === '') && delete queryParams[key]);

    const response = await api.get(`/bus/by-agency/${agencyId}`, { params: queryParams });
    return response.data;
  },

  getBusStats: async (agencyId) => {
    const response = await api.get(`/bus/stats/by-agency/${agencyId}`);
    return response.data;
  },

  getBus: async (busId) => {
    const response = await api.get(`/bus/${busId}`);
    return response.data;
  },

  addBus: async (busData) => {
    const response = await api.post("/bus", busData);
    return response.data;
  },

  updateBus: async (busId, busData) => {
    const response = await api.put(`/bus/${busId}`, busData);
    return response.data;
  },

  deleteBus: async (busId) => {
    const response = await api.delete(`/bus/${busId}`);
    return response.data;
  },

  // Routes management
  getRoutes: async () => {
    const response = await api.get("/route");
    return response.data;
  },

  getRoute: async (routeId) => {
    const response = await api.get(`/route/${routeId}`);
    return response.data;
  },

  addRoute: async (routeData) => {
    const response = await api.post("/route", routeData);
    return response.data;
  },

  updateRoute: async (routeId, routeData) => {
    const response = await api.put(`/route/${routeId}`, routeData);
    return response.data;
  },

  deleteRoute: async (routeId) => {
    const response = await api.delete(`/route/${routeId}`);
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
  getStations: async (agencyId) => {
    const response = await api.get(`/station/by-agency/${agencyId}`);
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

  uploadDocuments: async (documents, agencyId) => {
    const formData = new FormData();
    documents.forEach(doc => {
      formData.append('documents', doc.file);
      formData.append('types', doc.type);
    });
    formData.append("agencyId", agencyId)

    return api.post('/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
