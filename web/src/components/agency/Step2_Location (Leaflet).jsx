import React from "react";
import { MapSelector } from "../maps/leaflet";

const Step2_Location = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 border-b border-warning">
      <MapSelector />
    </div>
  );
};

export default Step2_Location;
