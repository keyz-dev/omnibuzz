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
        await staffAPI.create(staffData);
        await fetchStaff();
        await fetchStaffStats();
        toast.success("Assignment request sent successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to add staff member.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [agencyProfile, fetchStaffStats, fetchStaff]
  );

  const updateStaff = useCallback(
    async (workerId, staffData) => {
      setLoading(true);
      try {
        const updatedStaff = await staffAPI.update(workerId, staffData);
        setStaff((prev) =>
          prev.map((s) => (s.id === workerId ? { ...s, ...updatedStaff } : s))
        );
        await fetchStaffStats();
        toast.success("Staff member updated successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to update staff member.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchStaffStats, fetchStaff]
  );

  const deleteStaff = useCallback(
    async (workerId) => {
      const originalStaff = [...staff];
      setStaff((prev) => prev.filter((s) => s.id !== workerId));

      try {
        await staffAPI.delete(workerId);
        await fetchStaff();
        await fetchStaffStats();
        toast.success("Staff member deleted successfully!");
      } catch (error) {
        setStaff(originalStaff);
        const errorMessage =
          error.response?.data?.message || "Failed to delete staff member.";
        toast.error(errorMessage);
      }
    },
    [staff, fetchStaffStats, fetchStaff]
  );

  const resendInvite = useCallback(
    async (workerId) => {
      setLoading(true);
      try {
        await staffAPI.resendInvite(workerId);
        await fetchStaffStats();
        await fetchStaff();
        toast.success("Invitation resent successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to resend invitation.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchStaffStats, fetchStaff]
  );

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
