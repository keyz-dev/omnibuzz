import React, { useRef, useEffect } from "react";
import ConfirmationBar from "../google/ConfirmationBar";

const LeafletMapView = ({ coordinates, address }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const defaultCenter = [4.0511, 9.7679]; // Douala, Cameroon
  const center = coordinates
    ? [coordinates.lat, coordinates.lng]
    : defaultCenter;

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      // Load Leaflet dynamically
      const loadLeaflet = async () => {
        // Add Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }

        // Initialize map
        mapInstanceRef.current = window.L.map(mapRef.current).setView(
          center,
          coordinates ? 15 : 11
        );

        // Add tile layer
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
          }
        ).addTo(mapInstanceRef.current);

        // Add marker if coordinates exist
        if (coordinates) {
          const customIcon = window.L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                width: 32px;
                height: 32px;
                background: #EF4444;
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                position: relative;
                transform: translate(-50%, -50%);
              "></div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          markerRef.current = window.L.marker(
            [coordinates.lat, coordinates.lng],
            {
              icon: customIcon,
            }
          ).addTo(mapInstanceRef.current);
        }
      };

      loadLeaflet();
    }

    // Update map view and marker when coordinates change
    if (mapInstanceRef.current) {
      if (coordinates) {
        mapInstanceRef.current.setView([coordinates.lat, coordinates.lng], 15);

        // Remove existing marker
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Add new marker
        const customIcon = window.L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: #EF4444;
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
              transform: translate(-50%, -50%);
            "></div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        markerRef.current = window.L.marker(
          [coordinates.lat, coordinates.lng],
          {
            icon: customIcon,
          }
        ).addTo(mapInstanceRef.current);
      }
    }
  }, [coordinates]);

  return (
    <div className="relative h-full w-full rounded-sm overflow-hidden border-2 z-[1] border-light_bg">
      <ConfirmationBar address={address} visible={!!coordinates} />
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default LeafletMapView;
