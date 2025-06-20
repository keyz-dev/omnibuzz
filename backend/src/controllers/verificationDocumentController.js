const { VerificationDocument, Agency } = require("../db/models");
const {
  BadRequestError,
  NotFoundError,
  ValidationError,
} = require("../utils/errors");
const {
  createVerificationDocumentSchema,
} = require("../schemas/verificationDocumentSchema");

const { cleanUpFileImages } = require('../utils/imageCleanup');
const { formatImageUrl } = require("../utils/agencyProfileUtils");

// Helper function to get file type string from mimetype
const getFileTypeFromMimetype = (mimetype) => {
  const mimeTypeMap = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG",
    "image/jpg": "JPEG",
    "image/png": "PNG",
  };
  return mimeTypeMap[mimetype] || mimetype;
};

class VerificationDocumentController {
  async uploadDocument(req, res, next) {
    try {
      const files = req.files;
      const { types, agencyId } = req.body;

      const typesArray = Array.isArray(types) ? types : [types];

      // Basic validation
      if (!files || !typesArray || files.length === 0 || files.length !== typesArray.length || !agencyId) {
        throw new BadRequestError("Invalid data. A file and a type are required for each document.")
      }

      const documentsToCreate = await Promise.all(files.map(async (file, index) => {
        const documentType = typesArray[index];
        const isAllowedFileType = VerificationDocument.isAllowedFileType(file.mimetype)

        if (!isAllowedFileType) {
          throw new BadRequestError("Invalid file type. Allowed types: PDF, JPEG, PNG")
        }

        return {
          agencyId: agencyId,
          fileName: file.originalname,
          url: file.path,
          type: documentType,
          fileType: getFileTypeFromMimetype(file.mimetype),
          status: 'pending',
        };
      }));

      const newDocuments = await VerificationDocument.bulkCreate(documentsToCreate);

      res.status(201).json({
        success: true,
        message: 'Documents uploaded successfully!',
        data: newDocuments,
      });
    } catch (error) {
      if (req.files) cleanUpFileImages(req);
      next(error)
    }
  }

  async approveDocument(req, res, next) {
    try {
      const document = await VerificationDocument.findByPk(req.params.id);
      if (!document) {
        throw new NotFoundError("Document not found");
      }

      if (document.status !== "pending") {
        throw new BadRequestError("Document is not in pending status");
      }

      document.status = "approved";
      await document.save();

      res.json({
        success: true,
        message: "Document approved successfully",
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectDocument(req, res, next) {
    try {
      const { reason } = req.body;
      if (!reason) {
        throw new BadRequestError("Rejection reason is required");
      }

      const document = await VerificationDocument.findByPk(req.params.id);
      if (!document) {
        throw new NotFoundError("Document not found");
      }

      if (document.status !== "pending") {
        throw new BadRequestError("Document is not in pending status");
      }

      document.status = "rejected";
      document.rejectionReason = reason;
      await document.save();

      res.json({
        success: true,
        message: "Document rejected successfully",
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVerificationStatus(req, res, next) {
    try {
      const { agencyId } = req.params;

      const agency = await Agency.findByPk(agencyId);
      if (!agency) {
        throw new NotFoundError("Agency not found");
      }
      const status = await agency.getVerificationStatus();
      res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRemark(req, res, next) {
    try {
      const { remark } = req.body;
      if (!remark) {
        throw new BadRequestError("Remark is required");
      }

      const document = await VerificationDocument.findByPk(req.params.id);
      if (!document) {
        throw new NotFoundError("Document not found");
      }

      document.remark = remark;
      await document.save();

      res.json({
        success: true,
        message: "Remark updated successfully",
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VerificationDocumentController();
