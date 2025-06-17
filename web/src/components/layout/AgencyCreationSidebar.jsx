// src/components/registration/RegistrationSidebar.jsx

import React, { useState } from "react";
import {
  Building2,
  LocateFixed,
  PhoneCall,
  BookmarkCheck,
  ArrowLeft,
  ImagePlus,
  Menu,
  X,
} from "lucide-react";
import OmniCard from "../../assets/images/omni-card.png";
import { Logo } from "../ui/";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header + Dropdown in a relative container */}
      <div className="relative lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white">
          <Logo size={120} />
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-lg p-6 flex flex-col gap-8">
            <nav>
              <ul className="space-y-5">
                {steps.map((step) => (
                  <li key={step.id} className="flex items-center gap-4">
                    <div
                      className={`
                        h-10 w-10 rounded-sm flex-shrink-0 flex items-center justify-center border
                        ${
                          currentStep === step.id ||
                          visitedSteps.includes(step.id)
                            ? "border-accent text-accent"
                            : "border-line_clr text-placeholder"
                        }
                      `}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-normal text-primary">{step.title}</h4>
                      <p className="text-sm text-secondary opacity-50">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-4 flex justify-between items-center text-sm">
              <a
                href="/"
                className="flex items-center gap-2 text-secondary hover:text-accent"
              >
                <ArrowLeft size={16} />
                Back to home
              </a>
              <a
                href="/signin"
                className="font-semibold text-secondary hover:text-accent"
              >
                Sign In
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[360px] flex-shrink-0 h-screen bg-light_bg border-r border-r-line_clr p-8 flex-col">
        <div className="flex items-center gap-3 mb-16">
          <Logo size={140} />
        </div>
        <nav>
          <ul className="space-y-10">
            {steps.map((step) => (
              <li key={step.id} className="flex items-center gap-4">
                <div
                  className={`
                    h-10 w-10 rounded-sm flex-shrink-0 flex items-center justify-center border
                    ${
                      currentStep === step.id || visitedSteps.includes(step.id)
                        ? "border-accent text-accent"
                        : "border-line_clr text-placeholder"
                    }
                  `}
                >
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-normal text-primary">{step.title}</h4>
                  <p className="text-sm text-secondary opacity-50">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center flex-1 flex flex-col justify-between">
          <div className="flex-1 w-full relative">
            <img
              src={OmniCard}
              alt="OmniBuzz Card"
              className="w-full object-cover h-full"
            />
            <div className="absolute inset-0 bg-white/60"></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <a
              href="/"
              className="flex items-center gap-2 text-secondary hover:text-accent"
            >
              <ArrowLeft size={16} />
              Back to home
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AgencyCreationSidebar;
