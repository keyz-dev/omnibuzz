import React, { useState } from "react";
import { ContactInfo } from "../ui";
import { useAgencyCreation } from "../../stateManagement/contexts";

const contactTypes = [
  { id: "business-email", label: "Business Email", type: "email" },
  { id: "phone", label: "Phone Number", type: "tel" },
  { id: "whatsapp", label: "WhatsApp", type: "tel" },
  { id: "website", label: "Website URL", type: "url" },
];

const Step3_ContactInfo = () => {
  const { nextStep, agencyCreationData, updateFormData, prevStep } =
    useAgencyCreation();

  const [contactFields, setContactFields] = useState(
    agencyCreationData?.contactInfo || []
  );

  const handleSubmit = () => {
    const contactInfo = contactFields.map(({ label: type, value }) => ({
      type,
      value,
    }));

    updateFormData({ contactInfo: contactInfo });
    nextStep();
  };

  return (
    <section className="w-full md:w-lg px-4 py-10 min-h-screen md:min-h-fit mx-auto">
      <ContactInfo
        title={"Contact Information"}
        description={"How can people reach your agency?"}
        onBack={prevStep}
        onSubmit={handleSubmit}
        contactFields={contactFields}
        setContactFields={setContactFields}
        contactTypes={contactTypes}
      />
    </section>
  );
};

export default Step3_ContactInfo;
