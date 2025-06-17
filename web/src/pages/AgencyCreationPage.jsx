import React from "react";
import {
  AgencyCreationProvider,
  useAgencyCreation,
} from "../stateManagement/contexts";
import AgencyCreationSidebar from "../components/layout/AgencyCreationSidebar"; // The left sidebar
import { useAuth } from "../stateManagement/contexts/AuthContext";
import { Navigate } from "react-router-dom";

// Import step components
import {
  Step1_AgencyDetails,
  Step2_Location,
  Step3_ContactInfo,
  Step4_Overview,
  Step5_CreationSuccess,
} from "../components/agency/";

// This is the main component that renders the correct step
const AgencyCreationFlow = () => {
  const { activeStep, STEPS, visitedSteps } = useAgencyCreation();

  const renderStep = () => {
    switch (activeStep) {
      case STEPS.AGENCY_SETUP:
        return <Step1_AgencyDetails />;
      case STEPS.LOCATION_SETUP:
        return <Step2_Location />;
      case STEPS.CONTACTINFO_SETUP:
        return <Step3_ContactInfo />;
      case STEPS.OVERVIEW:
        return <Step4_Overview />;
      case STEPS.SUCCESS:
        return <Step5_CreationSuccess />;
      default:
        return <Step1_AgencyDetails />;
    }
  };

  // Don't show the stepper on the success page
  if (activeStep === STEPS.SUCCESS) {
    return <Step5_CreationSuccess />;
  }

  return (
    <section className="flex flex-col lg:flex-row min-h-screen bg-white">
      <AgencyCreationSidebar
        currentStep={activeStep}
        visitedSteps={visitedSteps}
      />
      <main className="flex-1 grid place-items-center overflow-y-auto h-screen overflow-auto scrollbar-hide">
        {renderStep()}
      </main>
    </section>
  );
};

// The wrapper that provides the context
const AgencyCreationPage = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" state={{ from: "/agency-registration" }} />;
  }
  return (
    <AgencyCreationProvider>
      <AgencyCreationFlow />
    </AgencyCreationProvider>
  );
};

export default AgencyCreationPage;
