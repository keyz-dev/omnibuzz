import React from "react";
import {
  Building2,
  LocateFixed,
  PhoneCall,
  BookmarkCheck,
  ImagePlus,
} from "lucide-react";
import { StepSideBar } from "../ui";

const steps = [
  {
    id: 0,
    icon: <Building2 size={20} />,
    title: "Agency Setup",
    description: "Provide your business information",
  },
  {
    id: 1,
    icon: <LocateFixed size={20} />,
    title: "HeadQuarter Address",
    description: "Add the address of the headquarter",
  },
  {
    id: 2,
    icon: <PhoneCall size={20} />,
    title: "Contact Means",
    description: "Add a means by which customers will reach you",
  },
  {
    id: 3,
    icon: <ImagePlus size={20} />,
    title: "Image Addition",
    description: "Add images to your agency",
  },
  {
    id: 4,
    icon: <BookmarkCheck size={20} />,
    title: "Overview & Finish",
    description: "Cross-check your information",
  },
];

const AgencyCreationSidebar = ({ currentStep, visitedSteps }) => {
  return (
    <StepSideBar
      currentStep={currentStep}
      visitedSteps={visitedSteps}
      steps={steps}
      homePath="/"
    />
  );
};

export default AgencyCreationSidebar;
