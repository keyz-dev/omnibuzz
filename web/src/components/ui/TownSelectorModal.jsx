import React, { useState } from "react";
import { CAMEROON_TOWNS } from "../../constants/towns";
import { X, Check } from "lucide-react";
import { Input } from "./";
import { removeEmojis } from "../../utils/sanitize";

// Town Selector Modal Component
const TownSelectorModal = ({ isOpen, onClose, onAdd, selectedTowns, multipleSelection = true }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTowns, setTempSelectedTowns] = useState([]);
  
  const allTowns = CAMEROON_TOWNS.map((town) => town.city);
  const filteredTowns = allTowns.filter(
    (town) =>
      town.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTowns.includes(town)
  );

  const handleTownToggle = (town) => {
    if(!multipleSelection){
      onAdd(town);
      onClose();
    }
    setTempSelectedTowns(prev => 
      prev.includes(town) 
        ? prev.filter(t => t !== town)
        : [...prev, town]
    );
  };

  const handleAddSelected = () => {
    onAdd(tempSelectedTowns);
    setTempSelectedTowns([]);
    setSearchTerm("");
    // onClose();
  };

  const handleClose = () => {
    setTempSelectedTowns([]);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center p-4 z-10"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white rounded-xs p-6 w-full max-w-md mx-4 max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Towns</h3>
          <button
            onClick={handleClose}
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

        {/* Selected count indicator */}
        {tempSelectedTowns.length > 0 && (
          <div className="mb-3 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            {tempSelectedTowns.length} town{tempSelectedTowns.length > 1 ? 's' : ''} selected
          </div>
        )}

        {/* Towns List */}
        <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
          {filteredTowns.length > 0 ? (
            filteredTowns.map((town) => {
              const isSelected = tempSelectedTowns.includes(town);
              return (
                <button
                  key={town}
                  onClick={() => handleTownToggle(town)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 border flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "hover:bg-gray-50 hover:border-blue-300 border-transparent"
                  }`}
                >
                  <span>{town}</span>
                  {isSelected && <Check size={16} className="text-blue-600" />}
                </button>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">
              {searchTerm
                ? "No towns found matching your search"
                : "All towns have been selected"}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSelected}
            disabled={tempSelectedTowns.length === 0}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              tempSelectedTowns.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add Selected ({tempSelectedTowns.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default TownSelectorModal;