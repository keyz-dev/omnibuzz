import React, { useState } from "react";
import { useStation } from "../../stateManagement/contexts";
import { ContactInfo } from "../ui";

const contactTypes = [
  { id: "business-email", label: "Business Email", type: "email" },
  { id: "phone", label: "Phone Number", type: "tel" },
  { id: "whatsapp", label: "WhatsApp", type: "tel" },
  { id: "website", label: "Website URL", type: "url" },
];

const Step5_ContactSetup = () => {
  const { stationCreationData, setStationCreationData, prevStep, nextStep } =
    useStation();
  const [contactFields, setContactFields] = useState(
    stationCreationData.contactInfo
  );

  const handleSubmit = () => {
    const contactInfo = contactFields.map(({ label: type, value }) => ({
      type,
      value,
    }));

    setStationCreationData((prev) => ({
      ...prev,
      contactInfo: contactInfo,
    }));

    nextStep();
  };

  return (
    <section className="w-lg mx-auto">
      <ContactInfo
        title={"Contact Setup"}
        description={"Add contact media for your station here."}
        onBack={prevStep}
        onSubmit={handleSubmit}
        contactFields={contactFields}
        setContactFields={setContactFields}
        contactTypes={contactTypes}
      />
    </section>
  );
};

export default Step5_ContactSetup;
