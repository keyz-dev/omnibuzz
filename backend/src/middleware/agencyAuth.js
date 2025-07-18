const { Agency, VerificationDocument, Station } = require("../db/models");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");
const { NotFoundError } = require("../utils/errors");

const isAgencyAdmin = async (req, res, next) => {
  if (!req.user.role.includes("admin")) {
    throw new UnauthorizedError(
      "You are not authorized to access this resource"
    );
  }
  next();
};

const isAgencyOwner = async (req, res, next) => {
  const agency = await Agency.findOne({
    where: { ownerId: req.user.id },
    include: [
      {
        model: VerificationDocument,
        as: "verificationDocuments",
      },
      {
        model: Station,
        as: "stations",
      },
    ],
  });
  if (!agency) {
    throw new NotFoundError("Agency not found");
  }
  if (agency.ownerId !== req.user.id && req.user.role !== "agency_admin") {
    throw new ForbiddenError("You are not authorized to access this agency");
  }

  req.agency = agency;
  next();
};

module.exports = {
  isAgencyAdmin,
  isAgencyOwner,
};
