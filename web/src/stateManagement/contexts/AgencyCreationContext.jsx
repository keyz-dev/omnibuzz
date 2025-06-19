import React, { createContext, useState, useContext } from "react";
import api from "../api";
import { FilterBAndW } from "@mui/icons-material";

const AgencyCreationContext = createContext();

const STEPS = {
  AGENCY_SETUP: 0,
  LOCATION_SETUP: 1,
  CONTACTINFO_SETUP: 2,
  IMAGE_ADDITION: 3,
  OVERVIEW: 4,
  SUCCESS: 5,
};

export const AgencyCreationProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(STEPS.AGENCY_SETUP);
  const [visitedSteps, setVisitedSteps] = useState([STEPS.AGENCY_SETUP]);
  const [isLoading, setIsLoading] = useState(false);
  const [agencyCreationData, setAgencyCreationData] = useState({
    name: "",
    headAddress: "",
    description: "",
    coordinates: null,
    contactInfo: [],
    agencyImages: [],
    towns: [],
    logo: null,
  });

  const updateFormData = (stepData) => {
    setAgencyCreationData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    setVisitedSteps((prev) => [...prev, activeStep]);
    setActiveStep((prev) => Math.min(prev + 1, STEPS.SUCCESS));
  };

  const prevStep = () => {
    setVisitedSteps((prev) => prev.slice(0, -1));
    setActiveStep((prev) => Math.max(prev - 1, STEPS.AGENCY_SETUP));
  };

  const createAgency = async () => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", agencyCreationData.name);
    formData.append("headAddress", agencyCreationData.headAddress);
    formData.append("description", agencyCreationData.description);
    formData.append(
      "coordinates",
      JSON.stringify(agencyCreationData.coordinates)
    );
    formData.append("towns", JSON.stringify(agencyCreationData.towns));
    formData.append(
      "contactInfo",
      JSON.stringify(agencyCreationData.contactInfo)
    );
    formData.append("logo", agencyCreationData.logo);
    agencyCreationData.agencyImages.forEach((image) => {
      formData.append("agencyImages", image);
    });

    try {
      const res = await api.post("/agency", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return res.data;
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.error?.[0]?.message ||
          error.response?.data?.message ||
          error.message ||
          "Unknown error occured. Please try again later.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    activeStep,
    visitedSteps,
    isLoading,
    agencyCreationData,
    STEPS,
    setAgencyCreationData,
    nextStep,
    prevStep,
    updateFormData,
    createAgency,
  };

  return (
    <AgencyCreationContext.Provider value={value}>
      {children}
    </AgencyCreationContext.Provider>
  );
};

export const useAgencyCreation = () => {
  const context = useContext(AgencyCreationContext);
  if (!context) {
    throw new Error(
      "useAgencyCreation must be used within AgencyCreationProvider"
    );
  }
  return context;
};
