import React from "react";
import {
  Baseline,
  LocateFixed,
  PhoneCall,
  ImagePlus,
  CreditCard,
  UserCog,
} from "lucide-react";
import { StepSideBar } from "../ui";

const defaultSteps = [
  {
    id: 0,
    icon: <Baseline size={20} />,
    title: "Basic Information",
    description: "Enter some basic about the station",
  },
  {
    id: 1,
    icon: <LocateFixed size={20} />,
    title: "Location Verification",
    description: "Verify the location of the station",
  },
  {
    id: 2,
    icon: <ImagePlus size={20} />,
    title: "Image Upload",
    description: "Add images of your station",
  },
  {
    id: 3,
    icon: <CreditCard size={20} />,
    title: "Payment setup",
    description: "Add payment information",
  },
  {
    id: 4,
    icon: <PhoneCall size={20} />,
    title: "Contact setup",
    description: "Add contact media",
  },
  {
    id: 5,
    icon: <UserCog size={20} />,
    title: "Assign Manager",
    description: "Who will control the station",
  },
];

const StationCreationSideBar = ({ currentStep, visitedSteps }) => {
  return (
    <StepSideBar
      currentStep={currentStep}
      visitedSteps={visitedSteps}
      steps={defaultSteps}
      homePath="/agency/admin"
    />
  );
};

export default StationCreationSideBar;
