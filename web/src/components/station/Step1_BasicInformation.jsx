import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  TownSelectorModal,
  TownsInput,
  StepNavButtons,
  FormHeader,
  Loader,
} from "../ui";
import { useStation } from "../../stateManagement/contexts";
import { useAgency } from '../../stateManagement/contexts/dashboard'
import { useNavigate } from "react-router-dom";

const Step1_BasicInformation = () => {
  const navigate = useNavigate();
  const { stationCreationData, setStationCreationData, nextStep } =
    useStation();
  const { agencyProfile, isLoading: profileLoading } = useAgency();

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

  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    setCanContinue(isFormValid());
  }, [neighborhood, baseTown, destinationTowns]);

  // A method to check if the form fields are not empty
  const isFormValid = () => {
    return (
      neighborhood.trim() && baseTown.trim() && destinationTowns.length > 0
    );
  };

  if (profileLoading) return <Loader size={20} color="#c2c2c2" />;

  const { agency } = agencyProfile;

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

    const formDataToSubmit = {
      name: `${agency.name} ${neighborhood}`,
      neighborhood: neighborhood,
      baseTown: baseTown,
      destinations: destinationTowns,
    };

    setStationCreationData((prev) => ({
      ...prev,
      ...formDataToSubmit,
    }));
    nextStep();
  };

  return (
    <div className="w-full md:w-lg mx-auto px-6 py-10">
      <FormHeader
        title={"Basic Information"}
        description={"Provide the basic information about your station"}
      />
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
              additionalClasses="min-h-[25px] min-w-[25px] rounded-full h-[32px] w-[32px] grid place-items-center"
              onClickHandler={() => setIsBaseTownModalOpen(true)}
              leadingIcon={"fas fa-edit text-accent text-md"}
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
          multipleSelection={true}
        />

        <StepNavButtons
          onBack={() => navigate(-1)}
          onContinue={handleContinue}
          canContinue={canContinue}
          isLoading={false}
        />
      </form>

      {/* Town Selector Modal */}
      <TownSelectorModal
        isOpen={isBaseTownModalOpen}
        onClose={() => setIsBaseTownModalOpen(false)}
        onAdd={setBaseTown}
        selectedTowns={[]}
        multipleSelection={false}
      />
    </div>
  );
};

export default Step1_BasicInformation;
