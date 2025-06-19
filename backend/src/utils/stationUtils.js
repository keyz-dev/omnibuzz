// Helper function to format station data including images
const formatStationData = (station) => {
  const stationData = station.toJSON();

  // Format images
  if (stationData.images) {
    stationData.images = stationData.images.map((img) => formatImageUrl(img));
  }

  // Format owner avatar if present
  if (
    stationData.agency &&
    stationData.agency.owner &&
    stationData.agency.owner.avatar
  ) {
    stationData.agency.owner.avatar = formatImageUrl(
      stationData.agency.owner.avatar
    );
  }

  return stationData;
};
