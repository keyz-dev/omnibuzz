// Utility functions for agency profile completion steps
const { isLocalImageUrl } = require("./imageUtils");

function getStationCompletionStatus(stations) {
  if (!stations || stations.length === 0) {
    return "required";
  }
  return "completed";
}

function getVerificationCompletionStatus(
  verificationDocuments
) {
  if (!verificationDocuments || verificationDocuments.length === 0) {
    return "required";
  }
  const allApproved = verificationDocuments.every((doc) => doc.status === "approved");
  if (allApproved) return "completed";
  const allRejected = verificationDocuments.every((doc) => doc.status === "rejected");
  if (allRejected) return "rejected";
  return "pending_processing";
}

// Helper function to format image URLs
const formatImageUrl = (image) => {
  if (!image) return null;
  if (isLocalImageUrl(image)) {
    return `${process.env.SERVER_URL}${image}`;
  }
  return image;
};

const formatImageArray = (images) =>
  Array.isArray(images) ? images.map(formatImageUrl) : [];

// Helper function to format agency data including owner avatar
const formatAgencyData = (agency) => {
  const agencyData = agency.toJSON();

  // Format agency images
  agencyData.logo = formatImageUrl(agencyData.logo);
  if (agencyData.agencyImages) {
    agencyData.agencyImages = formatImageArray(agencyData.agencyImages);
  }

  // Format owner avatar if present
  if (agencyData.owner && agencyData.owner.avatar) {
    agencyData.owner.avatar = formatImageUrl(agencyData.owner.avatar);
  }

  // Format stations
  if (agencyData.stations && agencyData.stations.length > 0) {
    agencyData.stations = agencyData.stations.map((station) => {
      return {
        ...station,
        images: formatImageArray(station.images),
      };
    });
  }

  // Format verification documents
  if (
    agencyData.verificationDocuments &&
    agencyData.verificationDocuments.length > 0
  ) {
    agencyData.verificationDocuments = agencyData.verificationDocuments.map(
      (doc) => {
        return {
          ...doc,
          document: formatImageUrl(doc.document),
        };
      }
    );
  }

  return agencyData;
};

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

module.exports = {
  getStationCompletionStatus,
  getVerificationCompletionStatus,
  formatImageUrl,
  formatImageArray,
  formatAgencyData,
  formatStationData,
};
