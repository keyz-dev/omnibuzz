import React, { useRef, useEffect, useState } from 'react';
import ConfirmationBar from "../../../maps/google/ConfirmationBar";

const LeafletMapView = ({ center, zoom = 7, markers = [], coordinates, address }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // Handle different prop patterns - support both 'center' and 'coordinates'
  const mapCenter = center || (coordinates ? [coordinates.lat, coordinates.lng] : null);
  const confirmationAddress = address || (markers[0] && markers[0].popupContent);

  // Validate coordinates
  const validateCoordinates = (coords) => {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      return false;
    }
    const [lat, lng] = coords;
    return !isNaN(lat) && !isNaN(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180;
  };

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate map center
        if (!validateCoordinates(mapCenter)) {
          throw new Error(`Invalid map center coordinates: ${JSON.stringify(mapCenter)}`);
        }

        // Validate markers
        const invalidMarkers = markers.filter((marker, index) => {
          const isValid = validateCoordinates(marker.position);
          if (!isValid) {
            console.warn(`Invalid marker ${index}:`, marker);
          }
          return !isValid;
        });

        if (invalidMarkers.length > 0) {
          setDebugInfo({
            totalMarkers: markers.length,
            invalidMarkers: invalidMarkers.length,
            validMarkers: markers.length - invalidMarkers.length,
            sampleInvalidMarker: invalidMarkers[0]
          });
        }

        // Dynamically load Leaflet CSS if not present
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
          document.head.appendChild(link);

          // Wait for CSS to load
          await new Promise((resolve) => {
            link.onload = resolve;
            link.onerror = () => resolve(); // Continue even if CSS fails
          });
        }

        // Dynamically load Leaflet JS if not present
        if (!window.L) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Leaflet library'));
            document.head.appendChild(script);
          });
        }

        // Wait a bit for Leaflet to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize map only once
        if (!mapInstanceRef.current && mapRef.current && mapCenter) {
          try {
            mapInstanceRef.current = window.L.map(mapRef.current, {
              center: mapCenter,
              zoom: zoom,
              zoomControl: true,
              attributionControl: true
            });

            // Add tile layer with error handling
            const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 18,
              minZoom: 2,
              errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSI+VGlsZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'
            });

            tileLayer.on('tileerror', (e) => {
              console.warn('Tile loading error:', e);
            });

            tileLayer.addTo(mapInstanceRef.current);

            // Create a layer group to hold markers and add it to the map
            markersLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);

            // Map event listeners for debugging
            mapInstanceRef.current.on('zoomend', () => {
              console.log('Map zoom level:', mapInstanceRef.current.getZoom());
            });

            mapInstanceRef.current.on('moveend', () => {
              const center = mapInstanceRef.current.getCenter();
              console.log('Map center:', [center.lat, center.lng]);
            });

          } catch (mapError) {
            throw new Error(`Failed to initialize map: ${mapError.message}`);
          }
        }

        // Update map view if center changes
        if (mapInstanceRef.current && mapCenter) {
          mapInstanceRef.current.setView(mapCenter, zoom);
        }

        // Update markers with enhanced error handling
        if (markersLayerRef.current && window.L) {
          markersLayerRef.current.clearLayers(); // Clear old markers before adding new ones

          const validMarkersAdded = [];

          markers.forEach((markerInfo, index) => {
            if (validateCoordinates(markerInfo.position)) {
              try {
                // Create custom icon for better visibility
                const customIcon = window.L.divIcon({
                  className: 'custom-station-marker',
                  html: `
                    <div style="
                      background-color: #3B82F6;
                      border: 3px solid white;
                      border-radius: 50%;
                      width: 28px;
                      height: 28px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                      color: white;
                      font-weight: bold;
                      font-size: 12px;
                      cursor: pointer;
                      transition: transform 0.2s ease;
                    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                      ${validMarkersAdded.length + 1}
                    </div>
                  `,
                  iconSize: [28, 28],
                  iconAnchor: [14, 14],
                  popupAnchor: [0, -14]
                });

                const marker = window.L.marker(markerInfo.position, {
                  icon: customIcon,
                  title: `Station ${validMarkersAdded.length + 1}` // Tooltip on hover
                });

                if (markerInfo.popupContent) {
                  marker.bindPopup(markerInfo.popupContent, {
                    maxWidth: 350,
                    className: 'station-popup',
                    closeButton: true,
                    autoClose: false,
                    closeOnClick: false
                  });
                }

                markersLayerRef.current.addLayer(marker);
                validMarkersAdded.push(marker);

              } catch (markerError) {
                console.error(`Error creating marker ${index}:`, markerError, markerInfo);
              }
            }
          });

          console.log(`Successfully added ${validMarkersAdded.length} out of ${markers.length} markers`);

          // If there are multiple markers, fit the map to show all of them
          if (validMarkersAdded.length > 1) {
            try {
              const group = new window.L.featureGroup(validMarkersAdded);
              if (group.getBounds().isValid()) {
                mapInstanceRef.current.fitBounds(group.getBounds(), {
                  padding: [30, 30],
                  maxZoom: 12 // Don't zoom in too much
                });
              }
            } catch (boundsError) {
              console.error('Error fitting bounds:', boundsError);
            }
          }
        }

        setIsLoading(false);

      } catch (err) {
        console.error('LeafletMapView error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (mapCenter) {
      loadLeaflet();
    } else {
      setError('No valid map center provided');
      setIsLoading(false);
    }
  }, [mapCenter, zoom, markers]); // Re-run the effect if props change

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (cleanupError) {
          console.warn('Error during map cleanup:', cleanupError);
        }
      }
    };
  }, []);

  if (error) {
    return (
      <div className="relative h-full w-full rounded-sm overflow-hidden border-2 border-red-200 bg-red-50">
        <div className="flex items-center justify-center h-full text-red-600 p-4">
          <div className="text-center space-y-3">
            <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-lg font-medium">Map Loading Error</div>
            <div className="text-sm max-w-md">{error}</div>
            {debugInfo && (
              <details className="text-xs text-left bg-red-100 p-2 rounded">
                <summary className="cursor-pointer font-medium">Debug Information</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-sm overflow-hidden border-2 z-[1] border-light_bg">
      {/* Only show confirmation bar if we have a single address */}
      {confirmationAddress && markers.length === 1 && (
        <ConfirmationBar address={confirmationAddress} visible={!!mapCenter} />
      )}

      <div ref={mapRef} style={{ height: '100%', width: '100%' }}>
        {isLoading && (
          <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <div className="text-lg font-medium">Loading map...</div>
              <div className="text-sm">Preparing station locations</div>
              {debugInfo && (
                <div className="text-xs text-gray-600">
                  Found {debugInfo.validMarkers} valid markers out of {debugInfo.totalMarkers}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced custom CSS for markers and popups */}
      <style jsx>{`
        .custom-station-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .station-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
        }
        
        .station-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
          min-width: 200px;
        }
        
        .station-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-right: none;
        }
        
        .leaflet-popup-close-button {
          font-size: 18px !important;
          padding: 4px 8px !important;
          color: #6b7280 !important;
        }
        
        .leaflet-popup-close-button:hover {
          color: #374151 !important;
          background: rgba(0,0,0,0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default LeafletMapView;