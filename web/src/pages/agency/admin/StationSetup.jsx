import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import StationCreationSideBar from "../../../components/layout/StationCreation";
import {
  Step1_BasicInformation,
  Step2_LocationVerification,
  Step3_ImageUpload,
  Step4_PaymentSetup,
  Step5_ContactSetup,
  Step6_AssignManager,
} from "../../../components/station";
import { useStationCreation } from "../../../contexts/dashboard/agency_admin";
import { Navigate } from "react-router-dom";
import { Loader } from "../../../components/ui";

const StationSetupFlow = () => {
  const { activeStep, STEPS, visitedSteps } = useStationCreation();

  const renderStep = () => {
    switch (activeStep) {
      case STEPS.BASIC_INFORMATION:
        return <Step1_BasicInformation />;
      case STEPS.LOCATION_VERIFICATION:
        return <Step2_LocationVerification />;
      case STEPS.IMAGE_UPLOAD:
        return <Step3_ImageUpload />;
      case STEPS.PAYMENT_SETUP:
        return <Step4_PaymentSetup />;
      case STEPS.CONTACT_SETUP:
        return <Step5_ContactSetup />;
      case STEPS.ASSIGN_MANAGER:
        return <Step6_AssignManager />;
      default:
        return <Step1_BasicInformation />;
    }
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen bg-white">
      <StationCreationSideBar
        currentStep={activeStep}
        visitedSteps={visitedSteps}
      />
      <main className="flex-1 grid place-items-center overflow-y-auto h-screen overflow-auto scrollbar-hide">
        {renderStep()}
      </main>
    </section>
  );
};

const StationSetup = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  if (!user) {
    return (
      <Navigate to="/login" state={{ from: "/agency/admin/station-setup" }} />
    );
  }
  return (
      <StationSetupFlow />
  );
};

export default StationSetup;
