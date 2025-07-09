import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { schedulesAPI } from "../../../api/station_manager/schedules";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";

// Create the context
const SchedulesContext = createContext();

// Custom hook to use the context
export const useSchedules = () => {
  const context = useContext(SchedulesContext);
  if (!context) {
    throw new Error("useSchedules must be used within a SchedulesProvider");
  }
  return context;
};

// Create the provider component
export const SchedulesProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  // Fetch all schedules
  const fetchSchedules = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    if (!user.worker?.stationId) {
      setError("User not found");
      return;
    }

    try {
      const data = await schedulesAPI.fetchSchedules(
        user.worker.stationId,
        filters
      );
      setSchedules(data.data?.schedules || []);
    } catch (err) {
      setError(err.message || "Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all routes for the dropdown
  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!user.worker?.stationId) {
      setError("User not found");
      return;
    }
    try {
      const data = await schedulesAPI.fetchRoutes(user.worker.stationId);
      setRoutes(data.data?.routes || []);
    } catch (err) {
      setError(err.message || "Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchSchedules();
    fetchRoutes();
  }, [fetchSchedules, fetchRoutes]);

  // Create a new schedule
  const createSchedule = async (scheduleData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!user.worker?.stationId) {
      setError("User not found");
      return;
    }
    try {
      await schedulesAPI.createSchedule({
        stationId: user.worker.stationId,
        ...scheduleData,
      });
      await fetchSchedules();
      toast.success("Schedule created successfully!");
      setSuccess("Schedule created successfully!");
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to create schedule");
      setSuccess(null);
      toast.error(err.message || "Failed to create schedule");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    schedules,
    routes,
    loading,
    error,
    success,

    // Actions
    fetchSchedules,
    createSchedule,
    fetchRoutes,
    setError,
    setSuccess,
  };

  return (
    <SchedulesContext.Provider value={value}>
      {children}
    </SchedulesContext.Provider>
  );
};
