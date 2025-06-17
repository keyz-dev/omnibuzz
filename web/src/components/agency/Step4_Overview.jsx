import React from "react";
import { useAgencyCreation } from "../../stateManagement/contexts";
import AgencyOverviewHeader from "./overview/AgencyOverviewHeader";
import AgencyOverviewDescription from "./overview/AgencyOverviewDescription";
import AgencyOverviewTowns from "./overview/AgencyOverviewTowns";
import AgencyOverviewContacts from "./overview/AgencyOverviewContacts";
import { Button } from "../ui";

const Step4_Overview = () => {
  const { agencyCreationData, setAgencyCreationData } = useAgencyCreation();
  const {
    name,
    headAddress,
    description,
    towns = [],
    contactInfo = [],
    logo,
    coordinates,
  } = agencyCreationData;

  const handleSubmit = () => {
    console.log("submit");
    console.log(agencyCreationData);
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
          additionalClasses="bg-accent hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-lg"
          onClickHandler={handleSubmit}
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

export default Step4_Overview;
