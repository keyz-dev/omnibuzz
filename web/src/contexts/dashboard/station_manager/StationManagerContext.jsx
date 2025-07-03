import React, { createContext, useContext, useState } from 'react';

const StationManagerContext = createContext();

export const useStationManager = () => {
  const context = useContext(StationManagerContext);
  if (!context) {
    throw new Error('useStationManager must be used within StationManagerProvider');
  }
  return context;
};

export const StationManagerProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    error,
    loading,

    setError,
    setLoading
  };

  return (
    <StationManagerContext.Provider value={value}>
      {children}
    </StationManagerContext.Provider>
  );
};