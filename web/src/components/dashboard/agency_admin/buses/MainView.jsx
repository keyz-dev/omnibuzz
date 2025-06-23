import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAgency,
  useAgencyBuses,
  useAgencyStation,
} from "../../../../stateManagement/contexts/dashboard/agency_admin";
import { useDebounce } from "../../../../hooks/useDebounce";

// Import reusable UI components
import {
  Card,
  Button,
  Table,
  StatusPill,
  DropdownMenu,
  SearchBar,
  FilterDropdown,
} from "../../../ui";
import { AddBusModal, CardSection } from "./";
import { Trash2, Eye } from "lucide-react";

const MainView = ({ setView }) => {
  const { stations, fetchStations } = useAgencyStation();

  const {
    buses,
    busStats,
    pagination,
    loading,
    fetchBuses,
    fetchBusStats,
    deleteBus,
  } = useAgencyBuses();

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    station: "",
    type: "",
    status: "",
  });
  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    fetchStations();
    fetchBusStats();
  }, [fetchStations, fetchBusStats]);

  useEffect(() => {
    fetchBuses(pagination.currentPage, { ...filters, search: debouncedSearch });
  }, [
    debouncedSearch,
    filters.station,
    filters.type,
    filters.status,
    pagination.currentPage,
  ]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBus = (type) => {
    setShowAddOptions(false);
    if (type === "single") {
      setIsModalOpen(true);
    } else if (type === "bulk") {
      navigate("/agency/admin/buses/bulk-import");
    }
  };

  const handleDeleteBus = (busId) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      deleteBus(busId);
    }
  };

  const columns = [
    { Header: "Plate Number", accessor: "plateNumber" },
    { Header: "Base Station", accessor: "baseStation.name" },
    { Header: "Type", accessor: "busType" },
    { Header: "Capacity", accessor: "capacity" },
    { Header: "Seat Layout", accessor: "seatLayout" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => <StatusPill status={row.status} />,
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const items = [
          {
            label: "View Details",
            icon: <Eye size={16} />,
            onClick: () => console.log("View bus", row.id),
          },
          {
            label: "Delete Bus",
            icon: <Trash2 size={16} />,
            onClick: () => handleDeleteBus(row.id),
            isDestructive: true,
          },
        ];
        return <DropdownMenu items={items} />;
      },
    },
  ];

  return (
    <section>
      {/* bus stats */}
      <CardSection busStats={busStats} />

      {/* add bus button */}
      <div className="flex flex-wrap items-center justify-end gap-4 my-4">
        <div className="relative">
          <Button
            onClickHandler={() => setShowAddOptions(!showAddOptions)}
            additionalClasses="bg-accent text-white"
            leadingIcon="fas fa-plus"
          >
            Add New Bus
          </Button>
          {showAddOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <a
                href="#"
                onClick={() => handleAddBus("single")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Single Insert
              </a>
              <a
                href="#"
                onClick={setView}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Bulk Import
              </a>
            </div>
          )}
        </div>
      </div>

      {/* search and filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <SearchBar
            placeholder="Search by plate number..."
            searchTerm={filters.search}
            setSearchTerm={(value) => handleFilterChange("search", value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <FilterDropdown
            label="Station"
            options={stations.map((s) => ({ value: s.id, label: s.name }))}
            selected={filters.station}
            setSelected={(value) => handleFilterChange("station", value)}
          />
          <FilterDropdown
            label="Type"
            options={["Classic", "VIP", "Standard"].map((t) => ({
              value: t,
              label: t,
            }))}
            selected={filters.type}
            setSelected={(value) => handleFilterChange("type", value)}
          />
          <FilterDropdown
            label="Status"
            options={[
              "Active",
              "Available",
              "Under Maintenance",
              "Inactive",
            ].map((s) => ({ value: s, label: s }))}
            selected={filters.status}
            setSelected={(value) => handleFilterChange("status", value)}
          />
        </div>
      </div>

      {/* bus table */}
      <section>
        <Card>
          <Table columns={columns} data={buses} />
        </Card>
        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              onClickHandler={() => fetchBuses(pagination.currentPage - 1)}
              isDisabled={pagination.currentPage <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              onClickHandler={() => fetchBuses(pagination.currentPage + 1)}
              isDisabled={
                pagination.currentPage >= pagination.totalPages || loading
              }
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      {isModalOpen && <AddBusModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
};

export default MainView;
