import React from "react";
import { MapSelector } from "../maps";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const Step2_Location = () => {
  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-600">Loading Maps...</div>
        </div>
      }
    >
      <div className="min-h-screen w-full bg-gray-50 py-8">
        <MapSelector />
      </div>
    </LoadScript>
  );
};

export default Step2_Location;
