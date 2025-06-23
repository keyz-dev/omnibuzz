import React from "react";
import { ModalWrapper, Button, Loader } from "./";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{itemName}</span>? This action cannot
          be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" /> : "Delete"}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmDeleteModal;
