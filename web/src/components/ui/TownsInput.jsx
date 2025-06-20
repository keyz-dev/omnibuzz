import React from "react";
import { Tag, Button, TownSelectorModal } from "./";

const TownsInput = ({
  label,
  towns,
  setTowns,
  multipleSelection=true,
  isTownModalOpen,
  setIsTownModalOpen,
}) => {
  const addMultipleTowns = (newTowns) => {
    const uniqueNewTowns = newTowns.filter(town => !towns.includes(town));
    if (uniqueNewTowns.length > 0) {
      setTowns((prev) => [...prev, ...uniqueNewTowns]);
    }
  };

  const removeTown = (townToRemove) => {
    setTowns((prev) => prev.filter((town) => town !== townToRemove));
  };

  const clearAllTowns = () => {
    setTowns([]);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-gray-700 text-sm font-medium">
            {label} <span className="text-red-500">*</span>
          </label>
          {towns.length > 0 && (
            <button
              type="button"
              onClick={clearAllTowns}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="w-full flex gap-2 justify-between items-start">
          <div className="flex flex-1 flex-wrap min-h-[40px] p-2 border border-line_clr rounded-xs gap-2">
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
            additionalClasses="border border-accent min-h-[25px] min-w-[25px] rounded-full h-[32px] w-[32px] grid place-items-center flex-shrink-0 mt-1"
            onClickHandler={() => setIsTownModalOpen(true)}
            leadingIcon={"fas fa-plus text-accent text-md"}
          />
        </div>

        {towns.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {towns.length} town{towns.length > 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Town Selector Modal */}
      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onAdd={addMultipleTowns}
        selectedTowns={towns}
        multipleSelection={multipleSelection}
      />
    </>
  );
};

export default TownsInput;