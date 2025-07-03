import React, { useState } from "react";
import { useStationCreation } from "../../contexts/dashboard/agency_admin";
import { MapSelector } from "../maps/leaflet";

const Step2_LocationVerification = () => {
  const { stationCreationData, setStationCreationData, nextStep, prevStep } =
    useStationCreation();

  const [address, setAddress] = useState(stationCreationData.name);

  const [coordinates, setCoordinates] = useState(
    stationCreationData.coordinates
  );

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!address || !coordinates) return;
    setStationCreationData({
      ...stationCreationData,
      address: address,
      coordinates: coordinates,
    });
    nextStep();
  };
  return (
    <div className="min-h-screen w-full py-8">
      <MapSelector
        prevStep={prevStep}
        setAddress={setAddress}
        setCoordinates={setCoordinates}
        handleConfirm={handleConfirm}
        coordinates={coordinates}
        address={address}
      />
    </div>
  );
};

export default Step2_LocationVerification;
