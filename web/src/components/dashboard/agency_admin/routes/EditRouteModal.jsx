import React, { useState, useEffect, useMemo } from "react";
import { ModalWrapper, Input, Button, Select, Loader } from "../../../ui";
import { useAgencyStation } from "../../../../contexts/dashboard/agency_admin";

const EditRouteModal = ({ isOpen, onClose, onSave, routeToEdit, isSaving }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    distance: "",
    estimatedDuration: "",
    basePrice: "",
    status: "Active",
  });
  const [error, setError] = useState("");
  const { stations } = useAgencyStation();

  useEffect(() => {
    if (routeToEdit) {
      setFormData({
        from: routeToEdit.from || "",
        to: routeToEdit.to || "",
        distance: routeToEdit.distance || "",
        estimatedDuration: routeToEdit.estimatedDuration || "",
        basePrice: routeToEdit.basePrice || "",
        status: routeToEdit.status || "Active",
      });
      setError("");
    }
  }, [routeToEdit]);

  const stationOptions = useMemo(
    () =>
      stations.map((s) => ({
        value: s.id,
        label: `${s.name} (${s.baseTown})`,
      })),
    [stations]
  );

  const destinationOptions = useMemo(() => {
    if (!formData.from) return [];
    const origin = stations.find((s) => s.id === formData.from);
    if (!origin) return [];
    return stationOptions.filter((opt) => {
      const station = stations.find((s) => s.id === opt.value);
      return station.baseTown !== origin.baseTown;
    });
  }, [formData.from, stations, stationOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "from") {
      setFormData((prev) => ({ ...prev, to: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.from || !formData.to || !formData.basePrice) {
      setError("Please fill in all required fields.");
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Route</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="from">Origin Station</label>
            <Select
              name="from"
              options={stationOptions}
              value={formData.from}
              onChange={(value) => handleSelectChange("from", value)}
              placeholder="Select Origin"
            />
          </div>
          <div>
            <label htmlFor="to">Destination Station</label>
            <Select
              name="to"
              options={destinationOptions}
              value={formData.to}
              onChange={(value) => handleSelectChange("to", value)}
              placeholder="Select Destination"
              disabled={!formData.from}
            />
          </div>
          <Input
            name="distance"
            label="Distance (km)"
            value={formData.distance}
            onChange={handleChange}
          />
          <Input
            name="estimatedDuration"
            label="Estimated Duration"
            value={formData.estimatedDuration}
            onChange={handleChange}
          />
          <Input
            name="basePrice"
            label="Base Price"
            value={formData.basePrice}
            onChange={handleChange}
            required
          />
          <div>
            <label htmlFor="status">Route Status</label>
            <Select
              name="status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              value={formData.status}
              onChange={(value) => handleSelectChange("status", value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onClose}
              additionalClasses="bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default EditRouteModal;
