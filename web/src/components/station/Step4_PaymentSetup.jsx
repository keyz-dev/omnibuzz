import React from "react";
import { PaymentSetup } from "./payment";
import { useStationCreation } from "../../contexts/dashboard/agency_admin";

// Demo wrapper
const Step4_PaymentSetup = () => {
  const { stationCreationData, setStationCreationData, prevStep, nextStep } =
    useStationCreation();
  const handleBack = () => {
    prevStep();
  };

  return (
    <PaymentSetup
      onBack={handleBack}
      onContinue={nextStep}
      stationCreationData={stationCreationData}
      setStationCreationData={setStationCreationData}
      prevStep={prevStep}
      nextStep={nextStep}
    />
  );
};

export default Step4_PaymentSetup;
