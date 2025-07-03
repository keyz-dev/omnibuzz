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

const formatImageUrl = (image) => {
  if (!image) return null;
  if (isLocalImageUrl(image)) {
    return `${process.env.SERVER_URL}${image}`;
  }
  return image;
};

module.exports = {
  getStationCompletionStatus,
  getVerificationCompletionStatus,
  formatImageUrl,
};
