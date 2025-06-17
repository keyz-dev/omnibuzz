import React, { useState } from "react";
import { TownSelectorModal } from "../../ui";

const AgencyOverviewTowns = ({ towns, setAgencyCreationData }) => {
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);

  const handleRemoveTown = (town) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      towns: prev.towns.filter((t) => t !== town),
    }));
  };
  const handleAddTown = (town) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      towns: [...(prev.towns || []), town],
    }));
  };

  return (
    <div>
      <div className="flex items-center gap-2 font-semibold mb-2 text-gray-800">
        Occupancy Towns ({towns.length.toString().padStart(2, "0")})
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {towns.length > 0 ? (
          towns.map((town, idx) => (
            <span
              key={idx}
              className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1"
            >
              {town}
              <button
                className="ml-1 text-gray-400 hover:text-red-500"
                onClick={() => handleRemoveTown(town)}
                title="Remove town"
                type="button"
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-400">No towns selected</span>
        )}
        {/* Add town button */}
        <button
          className="ml-2 text-green-600 hover:text-green-800 bg-green-100 rounded-full p-2 flex items-center justify-center"
          onClick={() => setIsTownModalOpen(true)}
          title="Add town"
          type="button"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onAdd={handleAddTown}
        selectedTowns={towns}
      />
    </div>
  );
};

export default AgencyOverviewTowns;
