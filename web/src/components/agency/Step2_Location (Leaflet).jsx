import React, { useState } from "react";
import { MapSelector } from "../maps/leaflet";
import { useAgencyCreation } from "../../contexts";

const Step2_Location = () => {
  const { agencyCreationData, setAgencyCreationData, nextStep, prevStep } =
    useAgencyCreation();

  const [address, setAddress] = useState(agencyCreationData.headAddress);

  const [coordinates, setCoordinates] = useState(
    agencyCreationData.coordinates
  );

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!address || !coordinates) return;
    setAgencyCreationData({
      ...agencyCreationData,
      headAddress: address,
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

export default Step2_Location;
