import React, { useState, useMemo } from "react";
import { SearchBar, Button, FilterDropdown } from "../../../ui";
import { WorkerCardSection, WorkerListView } from "./";

const WorkerMainView = ({
  staff,
  onAddWorker,
  onEditWorker,
  onDeleteWorker,
  onResendInvite,
  loading,
  stats,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredStaff = useMemo(() => {
    if (!staff) {
      return [];
    }
    return staff.filter((worker) => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = worker.user?.fullName?.toLowerCase() || "";
      const email = worker.user?.email?.toLowerCase() || "";

      return (
        (fullName.includes(searchLower) || email.includes(searchLower)) &&
        (roleFilter ? worker.role === roleFilter : true) &&
        (statusFilter
          ? statusFilter === "Active"
            ? worker.isActive
            : !worker.isActive // Simple example
          : true)
      );
    });
  }, [staff, searchTerm, roleFilter, statusFilter]);

  const roleOptions = [
    { value: "station_manager", label: "Station Manager" },
    { value: "ticket_agent", label: "Ticket Agent" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Invited", label: "Invited" }, // Assuming `isActive` false means invited
  ];

  return (
    <section>
      <WorkerCardSection stats={stats} />

      <div className="flex flex-col md:flex-row justify-end md:items-center mb-6 gap-4">
        <Button
          onClickHandler={onAddWorker}
          additionalClasses="bg-accent text-white"
          leadingIcon="fas fa-plus"
        >
          Add Staff Member
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="w-full lg:w-1/3">
          <SearchBar
            placeholder="Search by name or email"
            onSearch={setSearchTerm}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown
            label="Role"
            placeholder="Role: All"
            options={roleOptions}
            onSelect={setRoleFilter}
          />
          <FilterDropdown
            label="Status"
            placeholder="Status: All"
            options={statusOptions}
            onSelect={setStatusFilter}
          />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <WorkerListView
          workers={filteredStaff}
          onEdit={onEditWorker}
          onDelete={onDeleteWorker}
          onResendInvite={onResendInvite}
          loading={loading}
        />
      </div>
    </section>
  );
};

export default WorkerMainView;
