import React, { useState, useMemo, useEffect } from "react";
import { Input, Button, Select, FormHeader, ModalWrapper } from "../../../ui";
import { X } from "lucide-react";

const EditRouteModal = ({
  isOpen,
  onClose,
  onSave,
  stations,
  isSaving,
  routeToEdit,
  routes,
}) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    distance: "",
    estimatedDuration: "",
    basePrice: "",
    routeStatus: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && routeToEdit) {
      setFormData({
        from: String(routeToEdit.originStation?.id || ""),
        to: String(routeToEdit.destinationStation?.id || ""),
        distance: routeToEdit.distance || "",
        estimatedDuration: routeToEdit.estimatedDuration || "",
        basePrice: routeToEdit.basePrice || "",
        routeStatus: routeToEdit.status || "Active",
      });
      setErrors({});
    } else if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        from: "",
        to: "",
        distance: "",
        estimatedDuration: "",
        basePrice: "",
        routeStatus: "Active",
      });
      setErrors({});
    }
  }, [isOpen, routeToEdit]);

  const stationOptions = useMemo(
    () =>
      stations.map((s) => ({
        value: String(s.id),
        label: `${s.name} (${s.baseTown})`,
      })),
    [stations]
  );

  const destinationOptions = useMemo(() => {
    if (!formData.from) return [];

    const originStation = stations.find((s) => String(s.id) === formData.from);
    if (!originStation) return [];

    const existingDestinationIds = new Set(
      routes
        .filter(
          (route) =>
            String(route.originStation?.id) === formData.from &&
            String(route.id) !== String(routeToEdit?.id) // Exclude the current route being edited
        )
        .map((route) => String(route.destinationStation?.id))
    );

    return stationOptions.filter((opt) => {
      const destinationStationId = String(opt.value);
      if (destinationStationId === formData.from) return false;
      if (existingDestinationIds.has(destinationStationId)) return false;

      const destinationStation = stations.find(
        (s) => String(s.id) === destinationStationId
      );
      return (
        destinationStation &&
        destinationStation.baseTown !== originStation.baseTown
      );
    });
  }, [formData.from, routes, stations, stationOptions, routeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "from") newState.to = "";
      return newState;
    });
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.from) newErrors.from = "Origin station is required.";
    if (!formData.to) newErrors.to = "Destination station is required.";
    if (!formData.basePrice) newErrors.basePrice = "Base price is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedData = {
      from: formData.from,
      to: formData.to,
      distance: formData.distance,
      estimatedDuration: formData.estimatedDuration,
      basePrice: parseFloat(formData.basePrice),
      status: formData.routeStatus,
    };

    onSave(updatedData);
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 md:p-8 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Edit Route"
          subtitle="Update the details for this route"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Select
            label="Origin Station"
            name="from"
            placeholder="Select origin"
            options={stationOptions}
            value={formData.from}
            onChange={(e) => handleSelectChange("from", e.target.value)}
            error={errors.from}
            required
          />
          <Select
            label="Destination Station"
            name="to"
            placeholder="Select destination"
            options={destinationOptions}
            value={formData.to}
            onChange={(e) => handleSelectChange("to", e.target.value)}
            disabled={!formData.from}
            error={errors.to}
            required
          />
          <Input
            label="Distance (km)"
            name="distance"
            type="number"
            value={formData.distance}
            onChangeHandler={handleChange}
            placeholder="e.g., 250"
          />
          <Input
            label="Estimated duration (In Hours)"
            name="estimatedDuration"
            type="number"
            value={formData.estimatedDuration}
            onChangeHandler={handleChange}
            placeholder="e.g., 4 hours"
          />
          <Input
            label="Base Price (XAF) *"
            name="basePrice"
            type="number"
            value={formData.basePrice}
            onChangeHandler={handleChange}
            error={errors.basePrice}
            required
          />
          <Select
            label="Route Status"
            name="routeStatus"
            value={formData.routeStatus}
            onChange={(e) => handleSelectChange("routeStatus", e.target.value)}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
            required
          />
        </div>
        <div className="flex justify-end mt-8">
          <Button
            onClickHandler={handleSave}
            additionalClasses="bg-accent text-white"
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default EditRouteModal;
