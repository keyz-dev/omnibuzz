import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressInput } from "../ui";
import { useAgencyCreation } from "../../contexts";
import { StepNavButtons } from "./index";

const Step2_Location = () => {
  const { nextStep, agencyCreationData, updateFormData, prevStep } =
    useAgencyCreation();

  const [formData, setFormData] = useState({
    headAddress: "",
  });

  const [coordinates, setCoordinates] = useState(
    agencyCreationData?.coordinates || null
  );
  const [errors, setErrors] = useState({
    headAddress: "",
    coordinates: "",
  });

  const validateForm = () => {
    const newErrors = {
      headAddress: "",
      coordinates: "",
    };

    let isValid = true;

    if (!formData.headAddress.trim()) {
      newErrors.headAddress = "Headquarters address is required";
      isValid = false;
    }

    if (!coordinates) {
      newErrors.coordinates = "Please select a valid address with coordinates";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = {
      headAddress: formData.headAddress,
      coordinates: coordinates,
    };

    updateFormData(formDataToSubmit);
    nextStep();
  };

  return (
    <div className="w-lg mx-auto">
      <form className="py-4" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agency Location
          </h1>
          <p className="text-secondary">Tell us where your agency is located</p>
        </div>

        <div className="space-y-6">
          {/* Head Quarter Address */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Head Quarter Address <span className="text-red-500">*</span>
            </label>
            <AddressInput
              value={formData.headAddress}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, headAddress: value }))
              }
              error={errors.headAddress || errors.coordinates}
              onCoordinatesChange={setCoordinates}
              placeholder="Enter your headquarters address"
            />
          </div>

          <StepNavButtons
            onBack={() => prevStep()}
            onContinue={handleSubmit}
            canContinue={!!coordinates && !!formData.headAddress}
          />
        </div>
      </form>
    </div>
  );
};

export default Step2_Location;
