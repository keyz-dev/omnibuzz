import React from 'react';
import LeafletMapView from './LeafletMapView';

const StationsMapView = ({ stations }) => {
  console.log('Stations data received:', stations); // Debug log

  if (!stations || stations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No stations to display on the map.
      </div>
    );
  }

  // Enhanced coordinate extraction with multiple fallback patterns
  const extractCoordinates = (station) => {
    // Try different possible coordinate formats
    if (station.coordinates && Array.isArray(station.coordinates) && station.coordinates.length === 2) {
      return station.coordinates;
    }

    if (station.coordinates && typeof station.coordinates === 'object') {
      // Handle {lat: x, lng: y} or {latitude: x, longitude: y} format
      const lat = station.coordinates.lat || station.coordinates.latitude;
      const lng = station.coordinates.lng || station.coordinates.longitude || station.coordinates.lon;
      if (lat !== undefined && lng !== undefined) {
        return [parseFloat(lat), parseFloat(lng)];
      }
    }

    // Handle separate lat/lng properties
    if (station.lat !== undefined && station.lng !== undefined) {
      return [parseFloat(station.lat), parseFloat(station.lng)];
    }

    if (station.latitude !== undefined && station.longitude !== undefined) {
      return [parseFloat(station.latitude), parseFloat(station.longitude)];
    }

    // Handle location object
    if (station.location) {
      if (Array.isArray(station.location) && station.location.length === 2) {
        return station.location;
      }
      if (typeof station.location === 'object') {
        const lat = station.location.lat || station.location.latitude;
        const lng = station.location.lng || station.location.longitude || station.location.lon;
        if (lat !== undefined && lng !== undefined) {
          return [parseFloat(lat), parseFloat(lng)];
        }
      }
    }

    return null;
  };

  // Filter stations with valid coordinates and create markers
  const validStations = [];
  const markers = [];

  stations.forEach((station, index) => {
    const coordinates = extractCoordinates(station);

    if (coordinates && coordinates.length === 2 &&
      !isNaN(coordinates[0]) && !isNaN(coordinates[1]) &&
      coordinates[0] >= -90 && coordinates[0] <= 90 &&
      coordinates[1] >= -180 && coordinates[1] <= 180) {

      validStations.push({ ...station, coordinates });

      // Get the first image from the images array
      const firstImage = station.images && Array.isArray(station.images) && station.images.length > 0
        ? station.images[0]
        : null;

      // Create marker with enhanced popup content including image
      const popupContent = `
        <div class="font-sans flex flex-col">
          ${firstImage ? `
            <div class="mb-3 p-2 pt-6 flex-1">
              <img 
                src="${firstImage}" 
                alt="${station.name || 'Station'}" 
                class="w-full h-full object-cover rounded-t-lg"
                style=" object-fit: cover; border-radius: 6px 6px 0 0;"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
              />
              <div class="hidden bg-gray-100 h-32 flex items-center justify-center rounded-t-lg text-gray-500 text-sm">
                <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <br>Image not available
              </div>
            </div>
          ` : ''}
          <div class="p-3 ${firstImage ? 'pt-0' : ''}">
            <h3 class="font-bold text-lg mb-2 text-gray-800">${station.name || 'Unnamed Station'}</h3>
            ${station.baseTown ? `<p class="text-sm text-gray-600 mb-1"><strong>Town:</strong> ${station.baseTown}</p>` : ''}
            ${station.region ? `<p class="text-sm text-gray-600 mb-1"><strong>Region:</strong> ${station.region}</p>` : ''}
            ${station.address ? `<p class="text-sm text-gray-600 mb-1"><strong>Address:</strong> ${station.address}</p>` : ''}
            ${station.status ? `<p class="text-sm text-gray-600 mb-1"><strong>Status:</strong> <span class="px-2 py-1 rounded text-xs ${station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">${station.status}</span></p>` : ''}
            ${station.images && station.images.length > 1 ? `<p class="text-xs text-blue-600 mb-1">${station.images.length} images available</p>` : ''}
            <p class="text-xs text-gray-500 mt-2">Coordinates: ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}</p>
          </div>
        </div>
      `;

      markers.push({
        position: coordinates,
        popupContent: popupContent
      });
    } else {
      console.warn(`Station "${station.name || 'Unknown'}" has invalid coordinates:`, station);
    }
  });

  // Handle case where no valid stations exist
  if (validStations.length === 0) {
    return (
      <div className="p-6 text-center text-yellow-600 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex flex-col items-center space-y-2">
          <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">No Valid Station Coordinates</h3>
          <p className="text-sm">
            Found {stations.length} station(s), but none have valid coordinate data.
          </p>
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer text-yellow-700 hover:text-yellow-800">
              Show debugging information
            </summary>
            <pre className="mt-2 p-2 bg-yellow-100 rounded text-left overflow-x-auto">
              {JSON.stringify(stations.slice(0, 3), null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  // Calculate initial center based on valid stations
  let initialCenter;
  if (validStations.length === 1) {
    initialCenter = validStations[0].coordinates;
  } else {
    // Calculate center point of all stations
    const avgLat = validStations.reduce((sum, station) => sum + station.coordinates[0], 0) / validStations.length;
    const avgLng = validStations.reduce((sum, station) => sum + station.coordinates[1], 0) / validStations.length;
    initialCenter = [avgLat, avgLng];
  }

  // Determine appropriate zoom level based on station spread
  const getInitialZoom = () => {
    if (validStations.length === 1) return 10;

    // Calculate the bounding box of all stations
    const lats = validStations.map(s => s.coordinates[0]);
    const lngs = validStations.map(s => s.coordinates[1]);

    const latSpread = Math.max(...lats) - Math.min(...lats);
    const lngSpread = Math.max(...lngs) - Math.min(...lngs);
    const maxSpread = Math.max(latSpread, lngSpread);

    // Rough zoom level calculation
    if (maxSpread > 10) return 4;
    if (maxSpread > 5) return 5;
    if (maxSpread > 2) return 6;
    if (maxSpread > 1) return 7;
    if (maxSpread > 0.5) return 8;
    return 9;
  };

  return (
    <div className="h-[600px] w-full">
      {/* Status information */}
      <div className="mb-2 px-2 py-1 bg-blue-50 rounded-sm text-sm text-blue-700">
        Showing {validStations.length} of {stations.length} stations with valid coordinates
      </div>

      <LeafletMapView
        center={initialCenter}
        markers={markers}
        zoom={getInitialZoom()}
      />
    </div>
  );
};

export default StationsMapView;