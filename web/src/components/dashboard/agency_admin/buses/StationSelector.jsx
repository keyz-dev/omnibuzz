// StationSelector.jsx - Component for selecting station before import
import React from "react";

const StationSelector = ({
  stations,
  selectedStation,
  onStationChange,
  loading = false,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-sm border border-line_clr mb-4">
      <label
        htmlFor="station-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Station to assign buses to *
      </label>
      <select
        id="station-select"
        value={selectedStation}
        onChange={(e) => onStationChange(e.target.value)}
        disabled={loading}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        required
      >
        <option value="">-- Select a Station --</option>
        {stations.map((station) => (
          <option
            key={station.id || station.value}
            value={station.id || station.value}
          >
            {station.name || station.label}
          </option>
        ))}
      </select>
      {!selectedStation && (
        <p className="text-sm text-red-600 mt-1">
          Please select a station before importing buses
        </p>
      )}
    </div>
  );
};

export default StationSelector;
