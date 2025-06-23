import React, { useState, useMemo } from "react";
import { StatCard, SearchBar, Button, FilterDropdown } from "../../../ui";
import { PlusCircle } from "lucide-react";
import { RouteCardSection, RoutesListView } from "./";

const RoutesMainView = ({
  routes,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
  loading,
  stats,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredRoutes = useMemo(() => {
    if (!routes) {
      return [];
    }
    return routes.filter((route) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (route.from.toLowerCase().includes(searchLower) ||
          route.to.toLowerCase().includes(searchLower)) &&
        (originFilter ? route.from === originFilter : true) &&
        (destinationFilter ? route.to === destinationFilter : true) &&
        (statusFilter ? route.status === statusFilter : true)
      );
    });
  }, [routes, searchTerm, originFilter, destinationFilter, statusFilter]);

  console.log(routes);

  const originOptions = useMemo(
    () =>
      routes && routes.length > 0
        ? [...new Set(routes.map((r) => r.originStation))].map((from) => ({
            value: from.id,
            label: from.name,
          }))
        : [],
    [routes]
  );
  const destinationOptions = useMemo(
    () =>
      routes && routes.length > 0
        ? [...new Set(routes.map((r) => r.destinationStation))].map((to) => ({
            value: to.id,
            label: to.name,
          }))
        : [],
    [routes]
  );
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <section>
      <RouteCardSection routeStats={stats} />

      <div className="flex flex-col md:flex-row justify-end md:items-center mb-6 gap-4">
        <Button
          onClickHandler={onAddRoute}
          additionalClasses="bg-accent text-white"
          leadingIcon="fas fa-plus"
        >
          Add New Route
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="w-full md:w-1/3">
          <SearchBar placeholder="Search Routes" onSearch={setSearchTerm} />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown
            label="Origin"
            placeholder="Origin: N/A"
            options={originOptions}
            onSelect={setOriginFilter}
          />
          <FilterDropdown
            label="Destination"
            placeholder="Destination: N/A"
            options={destinationOptions}
            onSelect={setDestinationFilter}
          />
          <FilterDropdown
            label="Status"
            placeholder="Status: N/A"
            options={statusOptions}
            onSelect={setStatusFilter}
          />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {/* RoutesListView will go here */}
        <div>
          <RoutesListView
            routes={filteredRoutes}
            onEdit={onEditRoute}
            onDelete={onDeleteRoute}
          />
        </div>
      </div>
    </section>
  );
};

export default RoutesMainView;
