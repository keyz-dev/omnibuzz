import { createContext, useContext, useState } from "react";

import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  Route,
  Bus,
  Bell,
  BarChart3,
  Building2,
  User,
  Menu,
  X,
  ChevronDown,
  Search,
  Globe,
} from "lucide-react";

const AADContext = createContext();

export const AADProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user] = useState({
    name: "Afanyuy",
    role: "Manager",
    avatar: "/api/placeholder/40/40",
    agency: "General Express Voyage, Bonaberi",
  });

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      path: "/dashboard/bookings",
    },
    {
      id: "stations",
      label: "Stations",
      icon: MapPin,
      path: "/dashboard/stations",
    },
    { id: "staff", label: "Staff", icon: Users, path: "/dashboard/staff" },
    { id: "routes", label: "Routes", icon: Route, path: "/dashboard/routes" },
    { id: "buses", label: "Buses", icon: Bus, path: "/dashboard/buses" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/dashboard/notifications",
      badge: true,
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      path: "/dashboard/reports",
    },
    {
      id: "agency-profile",
      label: "Agency Profile",
      icon: Building2,
      path: "/dashboard/agency-profile",
    },
    {
      id: "my-profile",
      label: "My Profile",
      icon: User,
      path: "/dashboard/my-profile",
    },
  ];

  const getPageTitle = () => {
    const item = navigationItems.find((item) => item.id === currentPage);
    return item ? item.label : "Dashboard";
  };

  return (
    <AADContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sidebarCollapsed,
        setSidebarCollapsed,
        user,
        navigationItems,
        getPageTitle,
      }}
    >
      {children}
    </AADContext.Provider>
  );
};

export const useAAD = () => {
  const context = useContext(AADContext);
  if (!context) {
    throw new Error("useAAD must be used within AADProvider");
  }
  return context;
};
