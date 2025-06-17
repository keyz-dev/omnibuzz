import React from "react";
import { MapPin } from "lucide-react";

const SuggestionList = ({ suggestions, visible, onSelect, loading }) => {
  if (!visible || (!suggestions.length && !loading)) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
      {loading && <div className="px-4 py-3 text-gray-500">Searching...</div>}
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
        >
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 text-sm">
            {suggestion.display_name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SuggestionList;
