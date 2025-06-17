import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import ConfirmationBar from "./ConfirmationBar";

const GoogleMapView = ({ coordinates, address }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const defaultCenter = {
    lat: 4.0511, // Douala, Cameroon
    lng: 9.7679,
  };

  const center = coordinates || defaultCenter;

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  return (
    <div className="relative h-80 md:h-[450px] w-full rounded-lg overflow-hidden border border-gray-200">
      <ConfirmationBar address={address} visible={!!coordinates} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={coordinates ? 15 : 11}
        options={mapOptions}
      >
        {coordinates && (
          <Marker
            position={coordinates}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="8" fill="#EF4444"/>
                  <circle cx="16" cy="16" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapView;
