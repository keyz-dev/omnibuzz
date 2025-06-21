export const USER_ROLES = {
  ADMIN: "system_admin",
  AGENCY_ADMIN: "agency_admin",
  STATION_MANAGER: "station_manager",
  PASSENGER: "passenger",
};

export const ROLE_CONFIGS = {
  [USER_ROLES.ADMIN]: {
    basePath: "/admin",
    displayName: "Administrator",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "agencies", label: "Agencies", icon: "Building2" },
      { path: "documents", label: "Documents", icon: "FileText" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "reports", label: "Reports", icon: "BarChart3" },
      { path: "profile", label: "My Profile", icon: "User" },
    ],
  },
  [USER_ROLES.AGENCY_ADMIN]: {
    basePath: "/agency/admin",
    displayName: "Agency Admin",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "bookings", label: "Bookings", icon: "Calendar" },
      { path: "stations", label: "Stations", icon: "MapPin" },
      { path: "staff", label: "Staff", icon: "Users" },
      { path: "routes", label: "Routes", icon: "Route" },
      { path: "buses", label: "Buses", icon: "Bus" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "reports", label: "Reports", icon: "BarChart3" },
      { path: "agency-profile", label: "Agency Profile", icon: "Building" },
      { path: "profile", label: "My Profile", icon: "User" },
    ],
  },
  [USER_ROLES.STATION_MANAGER]: {
    basePath: "/agency/manager",
    displayName: "Station Manager",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "bookings", label: "Bookings", icon: "Calendar" },
      { path: "buses", label: "Buses", icon: "Bus" },
      { path: "routes", label: "Routes", icon: "Route" },
      { path: "schedules", label: "Schedules", icon: "Clock" },
      { path: "reports", label: "Reports", icon: "BarChart3" },
      { path: "profile", label: "Profile", icon: "User" },
    ],
  },
};
