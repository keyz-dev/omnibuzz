import React from "react";
import { useAgencyCreation, useAuth } from "../../contexts";
import AgencyOverviewHeader from "./overview/AgencyOverviewHeader";
import AgencyOverviewDescription from "./overview/AgencyOverviewDescription";
import AgencyOverviewTowns from "./overview/AgencyOverviewTowns";
import AgencyOverviewContacts from "./overview/AgencyOverviewContacts";
import { Button } from "../ui";
import { toast } from "react-toastify";

const Step5_Overview = () => {
  const {
    agencyCreationData,
    setAgencyCreationData,
    createAgency,
    isLoading,
    nextStep,
  } = useAgencyCreation();

  const { setUserAndToken } = useAuth();

  const {
    name,
    headAddress,
    description,
    towns = [],
    contactInfo = [],
    logo,
    coordinates,
  } = agencyCreationData;

  const handleSubmit = async () => {
    const hasBlankContact = contactInfo.some(
      (c) => !c.value || !c.value.trim()
    );
    if (hasBlankContact) {
      alert("Please fill in all contact information before submitting.");
      return;
    }
    try {
      const res = await createAgency();

      if (res.success) {
        toast.success("Agency created successfully");
        setUserAndToken(res.data.user, res.data.token);
        // wait for 2 seconds and navigate to the success page
        setTimeout(() => {
          nextStep();
        }, 2000);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Error creating agency", error.message);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-gray-50 rounded-xl shadow p-8 flex flex-col gap-6">
      <AgencyOverviewHeader
        name={name}
        logo={logo}
        headAddress={headAddress}
        coordinates={coordinates}
        setAgencyCreationData={setAgencyCreationData}
      />
      <AgencyOverviewDescription
        description={description}
        setAgencyCreationData={setAgencyCreationData}
      />
      <AgencyOverviewTowns
        towns={towns}
        setAgencyCreationData={setAgencyCreationData}
      />
      <AgencyOverviewContacts
        contactInfo={contactInfo}
        setAgencyCreationData={setAgencyCreationData}
      />
      {/* Finish Button */}
      <div className="flex justify-center mt-6">
        <Button
          additionalClasses="primarybtn"
          onClickHandler={handleSubmit}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

export default Step5_Overview;
