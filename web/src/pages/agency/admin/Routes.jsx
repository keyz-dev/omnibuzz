import React, { useState, useEffect, useCallback } from "react";
import {
  useAgencyRoutes,
  useAgencyStation,
} from "../../../contexts/dashboard/agency_admin";
import {
  RoutesMainView,
  AddRouteModal,
  EditRouteModal,
} from "../../../components/dashboard/agency_admin/routes";
import { ConfirmDeleteModal } from "../../../components/ui";

const AgencyRoutes = () => {
  const { stations, fetchStations } = useAgencyStation();
  const {
    routes,
    fetchRoutes,
    routeStats,
    fetchRouteStats,
    addRoute,
    updateRoute,
    deleteRoute,
    loading,
  } = useAgencyRoutes();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchStations();
    fetchRoutes();
    fetchRouteStats();
  }, [fetchStations, fetchRoutes, fetchRouteStats]);

  const handleAddRoute = useCallback(
    async (newRouteData) => {
      const routeToAdd = {
        from: newRouteData.from,
        to: newRouteData.to,
        distance: newRouteData.distance,
        estimatedDuration: newRouteData.estimatedDuration,
        basePrice: parseFloat(newRouteData.basePrice),
        status: newRouteData.routeStatus,
      };
      await addRoute(routeToAdd);
      setAddModalOpen(false);
    },
    [addRoute]
  );

  const handleEditRoute = (route) => {
    setSelectedRoute(route);
    setEditModalOpen(true);
  };

  const handleUpdateRoute = useCallback(
    async (updatedData) => {
      if (!selectedRoute) return;
      await updateRoute(selectedRoute.id, updatedData);
      setEditModalOpen(false);
      setSelectedRoute(null);
    },
    [updateRoute, selectedRoute]
  );

  const handleDeleteRoute = (route) => {
    setSelectedRoute(route);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedRoute) return;
    await deleteRoute(selectedRoute.id);
    setDeleteModalOpen(false);
    setSelectedRoute(null);
  }, [deleteRoute, selectedRoute]);

  return (
    <section>
      <RoutesMainView
        routes={routes}
        stats={routeStats}
        loading={loading}
        onAddRoute={() => setAddModalOpen(true)}
        onEditRoute={handleEditRoute}
        onDeleteRoute={handleDeleteRoute}
      />

      {isAddModalOpen && (
        <AddRouteModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddRoute}
          stations={stations}
          routes={routes}
          isSaving={loading}
        />
      )}

      {isEditModalOpen && selectedRoute && (
        <EditRouteModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateRoute}
          routeToEdit={selectedRoute}
          stations={stations}
          routes={routes}
          isSaving={loading}
        />
      )}

      {isDeleteModalOpen && selectedRoute && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete the route from ${selectedRoute.originStation.name} to ${selectedRoute.destinationStation.name}?`}
          isDeleting={loading}
        />
      )}
    </section>
  );
};

export default AgencyRoutes;
