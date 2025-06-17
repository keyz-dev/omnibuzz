import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Coordinates for the Centre Region of Cameroon (Yaoundé as reference)
const center = {
  lat: 3.848, 
  lng: 11.5021,
};
const marker_location = {
  lat: 3.809042, 
  lng: 11.556719,
}
const MapComponent = () => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {/* Marker for Yaoundé */}
        <Marker position={marker_location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
