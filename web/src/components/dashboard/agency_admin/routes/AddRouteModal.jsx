import React, { useState, useMemo, useEffect } from "react";
import { Input, Button, Select, FormHeader, ModalWrapper } from "../../../ui";
import { X } from "lucide-react";

const AddRouteModal = ({ isOpen, onClose, onSave, stations, isSaving }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    distance: "",
    estimatedDuration: "",
    basePrice: "",
    routeStatus: "Active",
  });

  const [errors, setErrors] = useState({});

  // When the modal opens, reset the form to its initial empty state
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

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
    const originStation = stations.find((s) => s.id === formData.from);
    if (!originStation) return [];
    return stationOptions.filter((opt) => {
      const station = stations.find((s) => s.id === opt.value);
      return station.baseTown !== originStation.baseTown;
    });
  }, [formData.from, stations, stationOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "from") {
        newState.to = ""; // Reset destination when origin changes
      }
      return newState;
    });
  };

  const formIsEmpty = Object.entries(formData)
    .filter(([key]) => key !== "routeStatus")
    .every(([, value]) => !value);

  const handleSave = () => {
    const newErrors = {};
    if (!formData.from) newErrors.from = "Origin station is required.";
    if (!formData.to) newErrors.to = "Destination station is required.";
    if (!formData.basePrice) newErrors.basePrice = "Base price is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
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
          title="Define a route"
          subtitle="Add a route for your buses"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Select
            label="Origin Station"
            name="from"
            placeholder="Select origin"
            options={stationOptions}
            value={formData.from}
            onChange={(value) => handleSelectChange("from", value.target.value)}
            error={errors.from}
            required
          />
          <Select
            label="Destination Station"
            name="to"
            placeholder="Select destination"
            options={destinationOptions}
            value={formData.to}
            onChange={(value) => handleSelectChange("to", value.target.value)}
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
            onChange={(value) =>
              handleSelectChange("routeStatus", value.target.value)
            }
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
            isDisabled={formIsEmpty}
          >
            Save Route
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddRouteModal;
