import React, { useState } from "react";
import { ImageUploadStep } from "../images";
import { useStation } from "../../stateManagement/contexts";

const Step3_ImageUpload = () => {
  const { stationCreationData, setStationCreationData, nextStep, prevStep } =
    useStation();
  const [stationImages, setStationImages] = useState(
    stationCreationData.images
  );

  const handleContinue = () => {
    const images = stationImages.map(({ file }) => file);

    setStationCreationData({
      ...stationCreationData,
      images: images,
    });
    nextStep();
  };

  return (
    <section>
      <ImageUploadStep
        images={stationImages}
        onImagesChange={setStationImages}
        entityType="Station"
        onBack={prevStep}
        onContinue={handleContinue}
      />
    </section>
  );
};

export default Step3_ImageUpload;
