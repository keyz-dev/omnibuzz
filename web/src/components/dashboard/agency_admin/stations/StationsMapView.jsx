import React from 'react';
import LeafletMapView from '../../../maps/leaflet/LeafletMapView';

const StationsMapView = ({ stations }) => {
  if (!stations || stations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No stations to display on the map.
      </div>
    );
  }

  const initialCenter = stations[0].address?.coordinates || [5.9631, 10.1591];

  const markers = stations.map(station => ({
    position: station.address.coordinates,
    popupContent: `
      <div class="font-sans">
        <h3 class="font-bold text-md mb-1">${station.name}</h3>
        <p class="text-sm text-gray-600">${station.address.fullAddress}</p>
      </div>
    `
  }));

  return (
    <div className="h-[600px] w-full">
      <LeafletMapView center={initialCenter} markers={markers} zoom={6} />
    </div>
  );
};

export default StationsMapView;
