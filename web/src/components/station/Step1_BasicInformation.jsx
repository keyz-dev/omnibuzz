import React, { useState } from "react";
import { Input, Button, TownSelectorModal, TownsInput } from "../ui";
import { useStation } from "../../stateManagement/contexts";

const Step1_BasicInformation = () => {
  const { stationCreationData, setStationCreationData, nextStep } =
    useStation();
  const [errors, setErrors] = useState({});
  const [isDesTownModalOpen, setIsDesTownModalOpen] = useState(false);
  const [isBaseTownModalOpen, setIsBaseTownModalOpen] = useState(false);

  // Local state for controlled fields
  const [neighborhood, setNeighborhood] = useState(
    stationCreationData.neighborhood || ""
  );
  const [baseTown, setBaseTown] = useState(stationCreationData.baseTown || "");
  const [destinationTowns, setDestinationTowns] = useState(
    stationCreationData.destinations || []
  );

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!neighborhood.trim())
      newErrors.neighborhood = "Neighborhood is required";
    if (!baseTown.trim()) newErrors.baseTown = "Base Town is required";
    if (destinationTowns.length === 0)
      newErrors.destinationTowns = "Select at least one destination town";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleContinue = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStationCreationData((prev) => ({
      ...prev,
      neighborhood,
      baseTown,
      destinations: destinationTowns,
    }));
    nextStep();
  };

  const handleAddTown = (town) => {
    if (!destinationTowns.includes(town)) {
      setDestinationTowns((prev) => [...prev, town]);
    }
  };
  const handleRemoveTown = (town) => {
    setDestinationTowns((prev) => prev.filter((t) => t !== town));
  };

  // Base Town selection (single select, using TownSelectorModal)
  const handleBaseTownSelect = (town) => {
    setBaseTown(town);
    setIsTownModalOpen(false);
  };

  return (
    <div className="w-full md:w-lg mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Setup a station
        </h1>
        <p className="text-secondary">
          Write down the basic information bout your station
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleContinue}>
        {/* Neighborhood */}
        <Input
          label="Neighborhood"
          name="neighborhood"
          placeholder="e.g Bonaberi"
          value={neighborhood}
          onChangeHandler={(e) => setNeighborhood(e.target.value)}
          error={errors.neighborhood}
          required
        />
        {/* Base Town */}
        <div>
          <label className="block text-base font-medium mb-1">
            Base Town <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 items-center">
            <Input
              name="baseTown"
              value={baseTown}
              placeholder="Select base town"
              onChangeHandler={() => {}}
              error={errors.baseTown}
              required={true}
              disabled={true}
              additionalClasses="bg-gray-100 cursor-pointer"
              onClickHandler={() => setIsBaseTownModalOpen(true)}
            />
            <Button
              type="button"
              additionalClasses="border border-accent min-h-[25px] min-w-[25px] rounded-full h-[32px] w-[32px] grid place-items-center"
              onClickHandler={() => setIsBaseTownModalOpen(true)}
              leadingIcon={"fas fa-plus text-accent text-md"}
            />
          </div>
        </div>
        {/* Destination Towns */}
        <TownsInput
          label="Destination Towns"
          towns={destinationTowns}
          setTowns={setDestinationTowns}
          isTownModalOpen={isDesTownModalOpen}
          setIsTownModalOpen={setIsDesTownModalOpen}
        />

        <div className="flex justify-end mt-8">
          <Button type="submit" additionalClasses="primarybtn px-8 py-2">
            Continue
          </Button>
        </div>
      </form>

      {/* Town Selector Modal */}
      <TownSelectorModal
        isOpen={isBaseTownModalOpen}
        onClose={() => setIsBaseTownModalOpen(false)}
        onAdd={setBaseTown}
        selectedTowns={[]}
      />
    </div>
  );
};

export default Step1_BasicInformation;
