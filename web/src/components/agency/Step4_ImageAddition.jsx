import React, { useState } from "react";
import { useAgencyCreation } from "../../stateManagement/contexts";
import { ImageUploadStep } from "../images";

const Step4_ImageAddition = () => {
  const { agencyCreationData, setAgencyCreationData, nextStep, prevStep } =
    useAgencyCreation();
  const [agencyImages, setAgencyImages] = useState(
    agencyCreationData.agencyImages
  );

  const handleBack = () => {
    console.log("Going back...");
    prevStep();
  };

  const handleContinue = () => {
    console.log("Continuing with images:", agencyImages);
    setAgencyCreationData({
      ...agencyCreationData,
      agencyImages: agencyImages,
    });
    nextStep();
  };

  // Helper to remove an image by index
  const handleRemoveImage = (idx) => {
    setAgencyImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <section>
      <ImageUploadStep
        images={agencyImages}
        onImagesChange={setAgencyImages}
        entityType="Agency"
        onBack={handleBack}
        onContinue={handleContinue}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {agencyImages.map((img, idx) => (
          <div key={idx} className="relative group">
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt={`Agency Image ${idx + 1}`}
              className="w-full h-32 object-cover rounded"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
              onClick={() => handleRemoveImage(idx)}
              title="Remove image"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Step4_ImageAddition;
