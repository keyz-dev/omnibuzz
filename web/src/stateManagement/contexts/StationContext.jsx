import React, { useContext, useState } from "react";

const StationContext = React.createContext();

const STEPS = {
  BASIC_INFORMATION: 0,
  LOCATION_VERIFICATION: 1,
  IMAGE_UPLOAD: 2,
  IMAGE_ADDITION: 3,
  PAYMENT_SETUP: 4,
  CONTACT_SETUP: 5,
  ASSIGN_MANAGER: 6,
  SUCCESS: 7,
};

export const StationProvider = ({ children }) => {
  const [stationCreationData, setStationCreationData] = useState({
    neighborhood: "",
    baseTown: "",
    address: "",
    coordinates: null,
    destinations: [],
    paymentMethods: [],
    images: [],
    contactInfo: [],
  });
  const [activeStep, setActiveStep] = useState(STEPS.BASIC_INFORMATION);
  const [visitedSteps, setVisitedSteps] = useState([STEPS.BASIC_INFORMATION]);

  const updateFormData = (stepData) => {
    setStationCreationData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    setVisitedSteps((prev) => [...prev, activeStep]);
    setActiveStep((prev) => Math.min(prev + 1, STEPS.SUCCESS));
  };

  const prevStep = () => {
    setVisitedSteps((prev) => prev.slice(0, -1));
    setActiveStep((prev) => Math.max(prev - 1, STEPS.BASIC_INFORMATION));
  };

  const value = {
    stationCreationData,
    activeStep,
    visitedSteps,
    STEPS,
    setStationCreationData,
    updateFormData,
    nextStep,
    prevStep,
  };

  return (
    <StationContext.Provider value={value}>{children}</StationContext.Provider>
  );
};

export const useStation = () => {
  return useContext(StationContext);
};
