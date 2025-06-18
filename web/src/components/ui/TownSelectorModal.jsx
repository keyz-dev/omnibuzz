import React, { useState } from "react";
import { CAMEROON_TOWNS } from "../../constants/towns";
import { X } from "lucide-react";
import { Input } from "./";
import { removeEmojis } from "../../utils/sanitize";

// Town Selector Modal Component
const TownSelectorModal = ({ isOpen, onClose, onAdd, selectedTowns }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const allTowns = CAMEROON_TOWNS.map((town) => town.city);
  const filteredTowns = allTowns.filter(
    (town) =>
      town.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTowns.includes(town)
  );

  const handleTownSelect = (town) => {
    onAdd(town);
    onClose();
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center p-4 z-10"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white rounded-xs p-6 w-full max-w-md mx-4 max-h-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Town</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search towns..."
            value={searchTerm}
            onChangeHandler={(e) => setSearchTerm(removeEmojis(e.target.value))}
            autoFocus={true}
          />
        </div>

        {/* Towns List */}
        <div className="max-h-60 overflow-y-auto space-y-1">
          {filteredTowns.length > 0 ? (
            filteredTowns.map((town) => (
              <button
                key={town}
                onClick={() => handleTownSelect(town)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 border border-transparent"
              >
                {town}
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              {searchTerm
                ? "No towns found matching your search"
                : "All towns have been selected"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TownSelectorModal;
