import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { staffAPI } from "../../../api/agency_admin/staff";
import { useAgency } from "./";

const AgencyStaffContext = createContext();

const AgencyStaffProvider = ({ children }) => {
  const { agencyProfile } = useAgency();
  const [staff, setStaff] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [staffStats, setStaffStats] = useState({
    total: 0,
    stationManagers: 0,
    ticketAgents: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStaff = useCallback(
    async (filters = {}) => {
      if (!agencyProfile?.agency?.id) return;
      setLoading(true);
      try {
        const data = await staffAPI.getAll(agencyProfile.agency.id, filters);
        const { data: workers, pagination } = data;

        setStaff(workers);
        setPagination({
          currentPage: pagination.page,
          totalPages: pagination.pages,
          totalRecords: pagination.total,
        });
      } catch (error) {
        toast.error("Failed to fetch staff.");
      } finally {
        setLoading(false);
      }
    },
    [agencyProfile]
  );

  const fetchStaffStats = useCallback(async () => {
    if (!agencyProfile?.agency?.id) return;
    try {
      const data = await staffAPI.getStats(agencyProfile.agency.id);
      setStaffStats(data.data);
    } catch (error) {
      toast.error("Failed to fetch staff statistics.");
      setStaffStats({ total: 0, stationManagers: 0, ticketAgents: 0 });
    }
  }, [agencyProfile]);

  const addStaff = useCallback(
    async (staffData) => {
      setLoading(true);
      try {
        const newStaff = await staffAPI.create(staffData);
        setStaff((prev) => [newStaff, ...prev]);
        fetchStaffStats(); // Refetch stats after adding
        toast.success("Staff member added successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to add staff member.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [agencyProfile, fetchStaffStats]
  );

  const updateStaff = useCallback(
    async (workerId, staffData) => {
      setLoading(true);
      try {
        const updatedStaff = await staffAPI.update(workerId, staffData);
        setStaff((prev) =>
          prev.map((s) => (s.id === workerId ? { ...s, ...updatedStaff } : s))
        );
        fetchStaffStats(); // Refetch stats if role changes
        toast.success("Staff member updated successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to update staff member.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchStaffStats]
  );

  const deleteStaff = useCallback(
    async (workerId) => {
      const originalStaff = [...staff];
      setStaff((prev) => prev.filter((s) => s.id !== workerId));
      toast.info("Deleting staff member...");

      try {
        await staffAPI.delete(workerId);
        fetchStaffStats(); // Refetch stats after deleting
        toast.success("Staff member deleted successfully!");
      } catch (error) {
        setStaff(originalStaff);
        const errorMessage =
          error.response?.data?.message || "Failed to delete staff member.";
        toast.error(errorMessage);
      }
    },
    [staff, fetchStaffStats]
  );

  const resendInvite = useCallback(async (workerId) => {
    setLoading(true);
    try {
      await staffAPI.resendInvite(workerId);
      toast.success("Invitation resent successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to resend invitation.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // state
    staff,
    pagination,
    staffStats,
    loading,

    // actions
    fetchStaff,
    fetchStaffStats,
    addStaff,
    updateStaff,
    deleteStaff,
    resendInvite,
  };

  return (
    <AgencyStaffContext.Provider value={value}>
      {children}
    </AgencyStaffContext.Provider>
  );
};

export default AgencyStaffProvider;

export const useAgencyStaff = () => {
  const context = useContext(AgencyStaffContext);
  if (!context) {
    throw new Error("useAgencyStaff must be used within AgencyStaffProvider");
  }
  return context;
};
