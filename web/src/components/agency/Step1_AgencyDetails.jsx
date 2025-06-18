import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, TextArea, FileUploader, TownsInput } from "../ui";
import { useAgencyCreation } from "../../stateManagement/contexts";
import { StepNavButtons } from "./index";

const Step1_AgencyDetails = () => {
  const navigate = useNavigate();
  const {
    nextStep,
    agencyCreationData,
    updateFormData,
    setAgencyCreationData,
  } = useAgencyCreation();

  const [occupancyTowns, setOccupancyTowns] = useState(
    agencyCreationData?.towns || []
  );
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    occupancyTowns: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAgencyCreationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      occupancyTowns: "",
    };

    let isValid = true;

    if (!agencyCreationData.name.trim()) {
      newErrors.name = "Agency legal name is required";
      isValid = false;
    }

    if (!agencyCreationData.description.trim()) {
      newErrors.description = "Agency description is required";
      isValid = false;
    }

    if (occupancyTowns.length === 0) {
      newErrors.occupancyTowns = "Please select at least one occupancy town";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = {
      name: agencyCreationData.name,
      description: agencyCreationData.description,
      towns: occupancyTowns,
      logo: logo,
    };

    updateFormData(formDataToSubmit);
    nextStep();
  };

  return (
    <>
      <div className="w-lg mx-auto">
        <form
          className="py-4"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Setup Your Agency
            </h1>
            <p className="text-secondary">Tell us about your bus agency</p>
          </div>

          {/* Logo section */}
          <div className="w-[30%] mb-4">
            <FileUploader
              preview={logoPreview}
              text="logo"
              onChange={(file) => {
                setLogo(file);
                setLogoPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <div className="space-y-6">
            {/* Agency Legal Name */}
            <Input
              label="Agency Legal Name"
              name="name"
              error={errors.name}
              value={agencyCreationData.name}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your agency's legal name"
            />

            {/* Occupancy Towns */}
            <TownsInput
              label="Occupancy Towns"
              towns={occupancyTowns}
              setTowns={setOccupancyTowns}
              isTownModalOpen={isTownModalOpen}
              setIsTownModalOpen={setIsTownModalOpen}
            />

            {/* Description Fields */}
            <div className="flex flex-col gap-4 flex-1">
              <TextArea
                label="Agency Description"
                name="description"
                value={agencyCreationData.description}
                error={errors.description}
                placeholder="Enter agency description"
                onChangeHandler={handleInputChange}
                required
              />
            </div>

            <StepNavButtons
              onBack={() => navigate(-1)}
              onContinue={handleSubmit}
              canContinue={
                !!agencyCreationData.name &&
                !!agencyCreationData.description &&
                occupancyTowns.length > 0
              }
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Step1_AgencyDetails;
