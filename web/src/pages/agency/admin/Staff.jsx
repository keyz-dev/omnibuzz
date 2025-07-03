import React, { useState, useEffect, useCallback } from "react";
import {
  useAgencyStaff,
  useAgencyStation,
} from "../../../contexts/dashboard/agency_admin";
import {
  WorkerMainView,
  AddWorkerModal,
} from "../../../components/dashboard/agency_admin/staff";
import { ConfirmDeleteModal } from "../../../components/ui";

const Staff = () => {
  const { stations, fetchStations } = useAgencyStation();
  const {
    staff,
    fetchStaff,
    staffStats,
    fetchStaffStats,
    addStaff,
    updateStaff,
    deleteStaff,
    resendInvite,
    loading,
  } = useAgencyStaff();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchStations();
    fetchStaff();
    fetchStaffStats();
  }, [fetchStations, fetchStaff, fetchStaffStats]);

  const handleAddStaff = useCallback(
    async (newWorkerData) => {
      await addStaff(newWorkerData);
      setAddModalOpen(false);
    },
    [addStaff]
  );

  const handleEditStaff = (worker) => {
    setSelectedWorker(worker);
    setEditModalOpen(true);
  };

  const handleUpdateStaff = useCallback(
    async (updatedData) => {
      if (!selectedWorker) return;
      await updateStaff(selectedWorker.id, updatedData);
      setEditModalOpen(false);
      setSelectedWorker(null);
    },
    [updateStaff, selectedWorker]
  );

  const handleDeleteStaff = (worker) => {
    setSelectedWorker(worker);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedWorker) return;
    await deleteStaff(selectedWorker.id);
    setDeleteModalOpen(false);
    setSelectedWorker(null);
  }, [deleteStaff, selectedWorker]);

  const handleResendInvite = useCallback(
    async (workerId) => {
      await resendInvite(workerId);
    },
    [resendInvite]
  );

  return (
    <div className="">
      <WorkerMainView
        staff={staff}
        stats={staffStats}
        loading={loading}
        onAddWorker={() => setAddModalOpen(true)}
        onEditWorker={handleEditStaff}
        onDeleteWorker={handleDeleteStaff}
        onResendInvite={handleResendInvite}
      />

      {isAddModalOpen && (
        <AddWorkerModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleAddStaff}
          stations={stations}
          isSaving={loading}
        />
      )}

      {isEditModalOpen && selectedWorker && (
        <AddWorkerModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateStaff}
          workerToEdit={selectedWorker}
          stations={stations}
          isSaving={loading}
        />
      )}

      {isDeleteModalOpen && selectedWorker && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete the staff member ${
            selectedWorker.user?.fullName || ""
          }?`}
          isDeleting={loading}
        />
      )}
    </div>
  );
};

export default Staff;
