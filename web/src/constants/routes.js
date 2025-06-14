// constants/routes.js
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  AGENCY_REGISTRATION: "/agency-registration",
  VERIFY_ACCOUNT: "/verify-account",
  // Passenger routes
  PASSENGER: {
    DASHBOARD: "/passenger",
    PROFILE: "/passenger/profile",
    BOOKINGS: "/passenger/bookings",
    SEARCH: "/passenger/search",
  },

  // Agency Admin routes
  AGENCY_ADMIN: {
    DASHBOARD: "/agency/admin",
    PROFILE: "/agency/admin/profile",
    BUSES: "/agency/admin/buses",
    ROUTES: "/agency/admin/routes",
    BOOKINGS: "/agency/admin/bookings",
    REPORTS: "/agency/admin/reports",
    SCHEDULES: "/agency/admin/schedules",
  },

  // Agency Manager routes
  STATION_MANAGER: {
    DASHBOARD: "/agency/manager",
    BOOKINGS: "/agency/manager/bookings",
    BUSES: "/agency/manager/buses",
    ROUTES: "/agency/manager/routes",
    PROFILE: "/agency/manager/profile",
    REPORTS: "/agency/manager/reports",
    SCHEDULES: "/agency/manager/schedules",
  },

  // System Admin routes
  SYSTEM_ADMIN: {
    DASHBOARD: "/admin",
    AGENCIES: "/admin/agencies",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },
};

export const USER_ROLES = {
  PASSENGER: "passenger",
  AGENCY_ADMIN: "agency_admin",
  STATION_MANAGER: "station_manager",
  SYSTEM_ADMIN: "system_admin",
};
