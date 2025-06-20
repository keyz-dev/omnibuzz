import api from "./config";
const API_BASE_URL = "/api/admin";

export const stationAPI = {
  // Station information
  getStationInfo: async () => {
    const response = await api.get("/info");
    return response.data;
  },

  updateStationInfo: async (stationData) => {
    const response = await api.put("/info", stationData);
    return response.data;
  },

  // Local bookings
  getLocalBookings: async (date = new Date()) => {
    const dateStr = date.toISOString().split("T")[0];
    const response = await api.get(`/bookings?date=${dateStr}`);
    return response.data;
  },

  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Bus movements
  getDepartures: async (date = new Date()) => {
    const dateStr = date.toISOString().split("T")[0];
    const response = await api.get(`/departures?date=${dateStr}`);
    return response.data;
  },

  getArrivals: async (date = new Date()) => {
    const dateStr = date.toISOString().split("T")[0];
    const response = await api.get(`/arrivals?date=${dateStr}`);
    return response.data;
  },

  // Bus status management
  updateBusStatus: async (busId, status) => {
    const response = await api.patch(`/buses/${busId}/status`, {
      status,
    });
    return response.data;
  },

  checkInBus: async (busId, actualArrivalTime) => {
    const response = await api.post(`/buses/${busId}/checkin`, {
      actualArrivalTime,
    });
    return response.data;
  },

  checkOutBus: async (busId, actualDepartureTime) => {
    const response = await api.post(`/buses/${busId}/checkout`, {
      actualDepartureTime,
    });
    return response.data;
  },

  // Daily schedules
  getDailySchedules: async (date = new Date()) => {
    const dateStr = date.toISOString().split("T")[0];
    const response = await api.get(`/schedules?date=${dateStr}`);
    return response.data;
  },

  // Station statistics
  getStationStats: async (period = "day") => {
    const response = await api.get(`/stats?period=${period}`);
    return response.data;
  },

  // Passenger management
  getPassengerManifest: async (busId) => {
    const response = await api.get(`/buses/${busId}/manifest`);
    return response.data;
  },

  verifyTicket: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/verify`);
    return response.data;
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await api.get("/announcements");
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await api.post("/announcements", announcementData);
    return response.data;
  },

  // Platform management
  getPlatforms: async () => {
    const response = await api.get("/platforms");
    return response.data;
  },

  assignPlatform: async (busId, platformId) => {
    const response = await api.patch(`/buses/${busId}/platform`, {
      platformId,
    });
    return response.data;
  },

  // Incident reporting
  reportIncident: async (incidentData) => {
    const response = await api.post("/incidents", incidentData);
    return response.data;
  },

  getIncidents: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/incidents?${params}`);
    return response.data;
  },

  // Real-time updates
  subscribeToUpdates: async (callback) => {
    // WebSocket connection for real-time updates
    const wsUrl = `${API_BASE_URL.replace("http", "ws")}/station/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return ws;
  },
};
