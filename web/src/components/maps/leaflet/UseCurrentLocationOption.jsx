import React from "react";
import { Navigation } from "lucide-react";

// UseCurrentLocationOption Component
const UseCurrentLocationOption = ({ visible, onUseLocation, loading }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xs shadow-lg z-50 mt-1">
      <button
        onClick={onUseLocation}
        disabled={loading}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 disabled:opacity-50"
      >
        <Navigation className="h-5 w-5 text-blue-500" />
        <span className="text-gray-700">
          {loading ? "Getting your location..." : "Use current location"}
        </span>
      </button>
    </div>
  );
};

export default UseCurrentLocationOption;
