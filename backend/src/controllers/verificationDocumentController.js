const { VerificationDocument, Agency } = require("../db/models");
const {
  BadRequestError,
  NotFoundError,
  ValidationError,
} = require("../utils/errors");
const {
  createVerificationDocumentSchema,
} = require("../schemas/verificationDocumentSchema");

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
      const documentTypesJson = req.body.documentTypes;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No files uploaded",
        });
      }

      if (!documentTypesJson) {
        // Clean up uploaded files
        files.forEach((file) => fs.unlinkSync(file.path));
        return res.status(400).json({
          success: false,
          error: "Document types are required",
        });
      }

      let documentTypes;
      try {
        documentTypes = JSON.parse(documentTypesJson);
      } catch (e) {
        files.forEach((file) => fs.unlinkSync(file.path));
        return res.status(400).json({
          success: false,
          error: "Invalid document types format",
        });
      }

      if (files.length !== documentTypes.length) {
        files.forEach((file) => fs.unlinkSync(file.path));
        return res.status(400).json({
          success: false,
          error: "Mismatch between uploaded files and document types",
        });
      }

      const savedDocuments = [];
      const validationErrors = [];

      // Process each document
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const docData = documentTypes[i];

        // Validate each document
        const validationPayload = {
          type: docData.type,
          fileType: file.mimetype,
          file: {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
          },
        };

        const { error } = documentSchema.validate(validationPayload);
        if (error) {
          validationErrors.push({
            file: file.originalname,
            error: error.details[0].message,
          });
          continue;
        }

        try {
          // Generate URL for the uploaded file
          const fileUrl = `/uploads/verification-documents/${file.filename}`;

          // Save to database using your model
          const document = await VerificationDocument.create({
            type: docData.type,
            fileType: getFileTypeFromMimetype(file.mimetype),
            url: fileUrl,
            agencyId: req.user.agencyId, // Assuming you have user context from middleware
            status: "pending", // Default status
          });

          savedDocuments.push({
            id: document.id,
            type: document.type,
            fileType: document.fileType,
            status: document.status,
            url: document.url,
            createdAt: document.createdAt,
          });
        } catch (dbError) {
          console.error("Database error:", dbError);
          validationErrors.push({
            file: file.originalname,
            error: "Failed to save document to database",
          });
        }
      }

      // If there were validation errors, clean up files and return errors
      if (validationErrors.length > 0) {
        files.forEach((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error("Error cleaning up file:", e);
          }
        });

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validationErrors,
        });
      }

      res.json({
        success: true,
        message: `${savedDocuments.length} documents uploaded successfully`,
        documents: savedDocuments,
      });
    } catch (error) {
      console.error("Upload error:", error);

      // Clean up uploaded files on error
      if (req.files) {
        req.files.forEach((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error("Error cleaning up file:", e);
          }
        });
      }

      res.status(500).json({
        success: false,
        error: "Internal server error during upload",
      });
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
