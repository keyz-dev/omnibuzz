import React from "react";
import { Tag, Button, TownSelectorModal } from "./";

const TownsInput = ({
  label,
  towns,
  setTowns,
  isTownModalOpen,
  setIsTownModalOpen,
}) => {
  const addTown = (town) => {
    if (town && !towns.includes(town)) {
      setTowns((prev) => [...prev, town]);
    }
  };

  const removeTown = (townToRemove) => {
    setTowns((prev) => prev.filter((town) => town !== townToRemove));
  };

  return (
    <>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {label} <span className="text-red-500">*</span>
        </label>

        <div className="w-full flex gap-2 justify-between items-center">
          <div className="flex flex-1 flex-wrap min-h-[40px] p-2 border border-line_clr rounded-xs gap-2 items-center">
            {towns.length > 0 ? (
              towns.map((town, index) => (
                <Tag key={index} onRemove={() => removeTown(town)}>
                  {town}
                </Tag>
              ))
            ) : (
              <span className="text-gray-400 text-sm py-1">
                No towns selected
              </span>
            )}
          </div>

          <Button
            type="button"
            additionalClasses="border border-accent min-h-[25px] min-w-[25px] rounded-full h-[32px] w-[32px] grid place-items-center"
            onClickHandler={() => setIsTownModalOpen(true)}
            leadingIcon={"fas fa-plus text-accent text-md"}
          />
        </div>
      </div>

      {/* Town Selector Modal */}
      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onAdd={addTown}
        selectedTowns={towns}
      />
    </>
  );
};

export default TownsInput;
