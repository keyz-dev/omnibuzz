import React, { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { StepNavButtons, Input } from "../ui";
import { PaymentMethodContainer, PaymentSetup } from "./payment";
import { useStation } from "../../stateManagement/contexts";

// Demo wrapper
const Step4_PaymentSetup = () => {
  const { stationCreationData, setStationCreationData, prevStep, nextStep } =
    useStation();
  const handleBack = () => {
    prevStep();
  };

  const handleContinue = (stationData) => {
    console.log("Navigate to next step with data:", stationData);
  };

  return (
    <PaymentSetup
      onBack={handleBack}
      onContinue={handleContinue}
      initialData={{}}
      stationCreationData={stationCreationData}
      setStationCreationData={setStationCreationData}
      prevStep={prevStep}
      nextStep={nextStep}
    />
  );
};

export default Step4_PaymentSetup;
