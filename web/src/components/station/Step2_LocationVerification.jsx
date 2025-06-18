import React, { useState } from "react";
import { useStation, useAgencyAdmin } from "../../stateManagement/contexts";
import { MapSelector } from "../maps/leaflet";

const Step2_LocationVerification = () => {
  const { stationCreationData, setStationCreationData, nextStep, prevStep } =
    useStation();
  const { myAgencyProfile } = useAgencyAdmin();

  const { agency } = myAgencyProfile;

  const [address, setAddress] = useState(stationCreationData.address);

  const [coordinates, setCoordinates] = useState(
    stationCreationData.coordinates
  );

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!address || !coordinates) return;
    setStationCreationData({
      ...stationCreationData,
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

export default Step2_LocationVerification;
