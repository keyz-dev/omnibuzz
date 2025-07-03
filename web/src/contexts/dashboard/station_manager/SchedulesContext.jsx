import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { schedulesAPI } from "../../../api/station_manager/schedules";

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

  // Fetch all schedules
  const fetchSchedules = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await schedulesAPI.fetchSchedules(filters);
      setSchedules(data);
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
    try {
      const data = await schedulesAPI.fetchRoutes();
      setRoutes(data);
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
    try {
      const newSchedule = await schedulesAPI.createSchedule(scheduleData);
      setSchedules((prev) => [...prev, newSchedule]);
      setSuccess("Schedule created successfully!");
      return { success: true, data: newSchedule };
    } catch (err) {
      setError(err.message || "Failed to create schedule");
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
    setError,
    setSuccess,
  };

  return (
    <SchedulesContext.Provider value={value}>
      {children}
    </SchedulesContext.Provider>
  );
};
