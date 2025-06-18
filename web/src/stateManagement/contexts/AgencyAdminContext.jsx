import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AgencyAdminContext = createContext();

export const AgencyAdminProvider = ({ children }) => {
  const [myAgencyProfile, setMyAgencyProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const setAgencyProfile = async (agency) => {
    setMyAgencyProfile(agency);
    localStorage.setItem("myAgency", JSON.stringify(agency));
  };

  const unsetAgencyProfile = () => {
    setMyAgencyProfile(null);
    localStorage.removeItem("myAgency");
  };

  useEffect(() => {
    const fetchMyAgency = async () => {
      setIsLoading(true);

      try {
        const response = await api.get("/agency/me");

        if (response.data.success) {
          setAgencyProfile(response.data.data);
        } else {
          unsetAgencyProfile();
        }
      } catch (error) {
        console.error(error);
        unsetAgencyProfile();
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyAgency();
  }, []);

  const value = {
    myAgencyProfile,
    isLoading,
    setAgencyProfile,
    unsetAgencyProfile,
  };

  return (
    <AgencyAdminContext.Provider value={value}>
      {children}
    </AgencyAdminContext.Provider>
  );
};

export const useAgencyAdmin = () => {
  const context = useContext(AgencyAdminContext);
  if (!context) {
    throw new Error("useAgencyAdmin must be used within AgencyAdminProvider");
  }
  return context;
};
