import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { routesAPI } from "../../../api/agency_admin/routes";
import { useAgency } from "./";

const AgencyRouteContext = createContext();

const AgencyRouteProvider = ({ children }) => {
  const { agencyProfile } = useAgency();
  const [routes, setRoutes] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [routeStats, setRouteStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchRoutes = useCallback(
    async (filters = {}) => {
      if (!agencyProfile?.agency?.id) return;
      setLoading(true);
      try {
        const data = await routesAPI.getAll(agencyProfile.agency.id, filters);
        setRoutes(data.routes);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalRecords: data.totalRecords,
        });
      } catch (error) {
        toast.error("Failed to fetch routes.");
      } finally {
        setLoading(false);
      }
    },
    [agencyProfile]
  );

  const fetchRouteStats = useCallback(async () => {
    if (!agencyProfile?.agency?.id) return;
    try {
      const stats = await routesAPI.getStats(agencyProfile.agency.id);
      setRouteStats(stats);
    } catch (error) {
      toast.error("Failed to fetch route statistics.");
      setRouteStats({ total: 0, active: 0, inactive: 0 });
    }
  }, [agencyProfile]);

  const addRoute = useCallback(
    async (routeData) => {
      if (!agencyProfile?.agency?.id) return;
      setLoading(true);
      try {
        const newRoute = await routesAPI.create(
          agencyProfile.agency.id,
          routeData
        );
        setRoutes((prev) => [newRoute, ...prev]);
        fetchRouteStats(); // Refetch stats after adding
        toast.success("Route added successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to add route.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [agencyProfile, fetchRouteStats]
  );

  const updateRoute = useCallback(
    async (routeId, routeData) => {
      setLoading(true);
      try {
        const updatedRoute = await routesAPI.update(routeId, routeData);
        setRoutes((prev) =>
          prev.map((r) => (r.id === routeId ? { ...r, ...updatedRoute } : r))
        );
        fetchRouteStats(); // Refetch stats if status changes
        toast.success("Route updated successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to update route.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchRouteStats]
  );

  const deleteRoute = useCallback(
    async (routeId) => {
      const originalRoutes = [...routes];
      setRoutes((prev) => prev.filter((r) => r.id !== routeId));
      toast.info("Deleting route...");

      try {
        await routesAPI.delete(routeId);
        fetchRouteStats(); // Refetch stats after deleting
        toast.success("Route deleted successfully!");
      } catch (error) {
        setRoutes(originalRoutes);
        const errorMessage =
          error.response?.data?.message || "Failed to delete route.";
        toast.error(errorMessage);
      }
    },
    [routes, fetchRouteStats]
  );

  const value = {
    // state
    routes,
    pagination,
    routeStats,
    loading,

    // actions
    fetchRoutes,
    fetchRouteStats,
    addRoute,
    updateRoute,
    deleteRoute,
  };

  return (
    <AgencyRouteContext.Provider value={value}>
      {children}
    </AgencyRouteContext.Provider>
  );
};

export default AgencyRouteProvider;

export const useAgencyRoutes = () => {
  const context = useContext(AgencyRouteContext);
  if (!context) {
    throw new Error("useAgencyRoutes must be used within AgencyRouteProvider");
  }
  return context;
};
