import React, { useContext, useState } from "react";
import api from "../api";

const StationContext = React.createContext();

const STEPS = {
  BASIC_INFORMATION: 0,
  LOCATION_VERIFICATION: 1,
  IMAGE_UPLOAD: 2,
  PAYMENT_SETUP: 3,
  CONTACT_SETUP: 4,
  ASSIGN_MANAGER: 5,
};

export const StationProvider = ({ children }) => {
  const [stationCreationData, setStationCreationData] = useState({
    name: "",
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
  const [isLoading, setIsLoading] = useState(false);
  const [createdStation, setCreatedStation] = useState({});

  const updateFormData = (stepData) => {
    setStationCreationData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    setVisitedSteps((prev) => [...prev, activeStep]);
    setActiveStep((prev) => Math.min(prev + 1, STEPS.ASSIGN_MANAGER));
  };

  const prevStep = () => {
    setVisitedSteps((prev) => prev.slice(0, -1));
    setActiveStep((prev) => Math.max(prev - 1, STEPS.BASIC_INFORMATION));
  };

  const assignWorker = async (worker) => {
    setIsLoading(true);
    if (!worker.stationId) {
      worker.stationId = createdStation.id;
    }

    try {
      const res = await api.post("/station/workers/assign", worker);
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

  const createStation = async (contactInfo) => {
    try {
      setIsLoading(true);

      const stationName = `${stationCreationData.neighborhood}`;

      const formData = new FormData();
      formData.append("neighborhood", stationCreationData.neighborhood);
      formData.append("baseTown", stationCreationData.baseTown);
      formData.append("address", stationCreationData.address);
      formData.append("name", stationName);
      formData.append(
        "coordinates",
        JSON.stringify(stationCreationData.coordinates)
      );
      formData.append(
        "destinations",
        JSON.stringify(stationCreationData.destinations)
      );
      formData.append(
        "paymentMethods",
        JSON.stringify(stationCreationData.paymentMethods)
      );
      stationCreationData.images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("contactInfo", JSON.stringify(contactInfo));

      const res = await api.post("/station", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCreatedStation(res.data.data);
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
    stationCreationData,
    activeStep,
    visitedSteps,
    STEPS,
    isLoading,
    setStationCreationData,
    updateFormData,
    nextStep,
    prevStep,
    createStation,
    assignWorker,
  };

  return (
    <StationContext.Provider value={value}>{children}</StationContext.Provider>
  );
};

export const useStation = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error("useStation must be used within a StationProvider");
  }
  return context;
};
