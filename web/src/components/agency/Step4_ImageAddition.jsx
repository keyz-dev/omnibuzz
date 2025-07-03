import React, { useState } from "react";
import { useAgencyCreation } from "../../contexts";
import { ImageUploadStep } from "../images";

const Step4_ImageAddition = () => {
  const { agencyCreationData, setAgencyCreationData, nextStep, prevStep } =
    useAgencyCreation();
  const [agencyImages, setAgencyImages] = useState(
    agencyCreationData.agencyImages
  );

  const handleContinue = () => {
    const images = agencyImages.map(({ file }) => file);

    setAgencyCreationData({
      ...agencyCreationData,
      agencyImages: images,
    });
    nextStep();
  };

  return (
    <section>
      <ImageUploadStep
        images={agencyImages}
        onImagesChange={setAgencyImages}
        entityType="Agency"
        onBack={prevStep}
        onContinue={handleContinue}
      />
    </section>
  );
};
export default Step4_ImageAddition;
