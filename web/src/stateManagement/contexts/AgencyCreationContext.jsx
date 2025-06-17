import React, { createContext, useState, useContext } from "react";

const AgencyCreationContext = createContext();

const STEPS = {
  AGENCY_SETUP: 0,
  LOCATION_SETUP: 1,
  CONTACTINFO_SETUP: 2,
  OVERVIEW: 3,
  SUCCESS: 4,
};

export const AgencyCreationProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(STEPS.AGENCY_SETUP);
  const [visitedSteps, setVisitedSteps] = useState([STEPS.AGENCY_SETUP]);
  const [agencyCreationData, setAgencyCreationData] = useState({
    name: "",
    headAddress: "",
    description: "",
    coordinates: null,
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

  const value = {
    activeStep,
    visitedSteps,
    agencyCreationData,
    STEPS,
    setAgencyCreationData,
    nextStep,
    prevStep,
    updateFormData,
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
