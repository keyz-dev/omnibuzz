import React, { useState } from "react";
import { useStation } from "../../stateManagement/contexts";
import { ContactInfo } from "../ui";
import { toast } from "react-toastify";

const contactTypes = [
  { id: "business-email", label: "Business Email", type: "email" },
  { id: "phone", label: "Phone Number", type: "tel" },
  { id: "whatsapp", label: "WhatsApp", type: "tel" },
  { id: "website", label: "Website URL", type: "url" },
];

const Step5_ContactSetup = () => {
  const {
    stationCreationData,
    setStationCreationData,
    prevStep,
    nextStep,
    createStation,
    isLoading,
  } = useStation();
  const [contactFields, setContactFields] = useState(
    stationCreationData.contactInfo
  );

  const handleSubmit = async () => {
    const contactInfo = contactFields.map(({ label: type, value }) => ({
      type,
      value,
    }));

    setStationCreationData((prev) => ({
      ...prev,
      contactInfo: contactInfo,
    }));

    // submit to backend
    const res = await createStation(contactInfo);
    if (res.success) {
      toast.success("Station created successfully");
      setTimeout(() => {
        nextStep();
      }, 2000);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <section className="w-full md:w-lg px-4 py-10 min-h-screen md:min-h-fit mx-auto">
      <ContactInfo
        title={"Contact Setup"}
        description={"Add contact media for your station here."}
        onBack={prevStep}
        onSubmit={handleSubmit}
        contactFields={contactFields}
        setContactFields={setContactFields}
        contactTypes={contactTypes}
        isLoading={isLoading}
      />
    </section>
  );
};

export default Step5_ContactSetup;
