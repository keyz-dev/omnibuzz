import React, { useState, useEffect } from "react";
import { useSchedules } from "../../../../contexts/dashboard/station_manager/SchedulesContext";
import SchedulesListView from "./SchedulesListView";
import AddScheduleModal from "./AddScheduleModal";
import { Button, SearchBar, FilterDropdown } from "../../../ui";

const SchedulesMainView = () => {
  const { fetchSchedules, schedules, loading } = useSchedules();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    busType: "",
  });

  useEffect(() => {
    const searchParams = { ...filters, search: searchTerm };
    fetchSchedules(searchParams);
  }, [searchTerm, filters, fetchSchedules]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Upcoming", label: "Upcoming" },
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const busTypeOptions = [
    { value: "", label: "All Bus Types" },
    { value: "Standard", label: "Standard" },
    { value: "VIP", label: "VIP" },
  ];

  return (
    <section>
      <div className="flex justify-end items-center mb-4">
        <Button
          onClickHandler={() => setIsModalOpen(true)}
          additionalClasses="bg-accent text-white"
        >
          Add Schedule
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="w-full lg:w-1/3">
          <SearchBar
            placeholder="Search by route..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown
            options={statusOptions}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          />
          <FilterDropdown
            options={busTypeOptions}
            value={filters.busType}
            onChange={(e) => handleFilterChange("busType", e.target.value)}
          />
        </div>
      </div>

      <SchedulesListView
        schedules={schedules}
        loading={loading}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default SchedulesMainView;
