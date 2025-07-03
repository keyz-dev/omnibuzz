const { VerificationDocument, Agency, User } = require("../db/models");
const {
  BadRequestError,
  NotFoundError,
} = require("../utils/errors");

const { cleanUpFileImages } = require('../utils/imageCleanup');

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

  // Get all documents with filtering and pagination
  async getDocuments(req, res) {
    try {
      const { page = 1, limit = 8, status, agencyId, search } = req.query;
      const offset = (page - 1) * limit;

      let where = {};
      if (status) where.status = status;
      if (agencyId) where.agencyId = agencyId;
      if (search) {
        where[Op.or] = [
          { fileName: { [Op.iLike]: `%${search}%` } },
          { type: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows } = await VerificationDocument.findAndCountAll({
        where,
        include: [
          {
            model: Agency,
            as: 'agency',
            attributes: ['name', 'logo'],
            include: [
              {
                model: User,
                as: 'owner',
                attributes: ['fullName', 'email'],
              },
            ],
          },
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page, 10),
        totalDocuments: count,
        documents: rows,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
  }

  // Get document statistics
  async getDocumentStats(req, res) {
    try {
      const total = await VerificationDocument.count();
      const pending = await VerificationDocument.count({ where: { status: 'pending' } });
      const approved = await VerificationDocument.count({ where: { status: 'approved' } });
      const rejected = await VerificationDocument.count({ where: { status: 'rejected' } });

      res.status(200).json({ all: total, pending, approved, rejected });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching document stats', error: error.message });
    }
  }

  // Update document status
  async updateDocumentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const document = await VerificationDocument.findByPk(id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      document.status = status;
      await document.save();

      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({ message: 'Error updating document status', error: error.message });
    }
  }

  // Add a remark to a document
  async addRemark(req, res, next) {
    try {
      const { id } = req.params;
      const { remark } = req.body;

      console.log("\n\nRemark: ", remark)

      const document = await VerificationDocument.findByPk(id);
      if (!document || !remark) {
        throw new NotFoundError("Document not found")
      }

      await document.update({ remark });

      console.log("\n\nDocument: ", document)

      res.status(200).json({ success: true, message: "Remark added successfully", data: document });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VerificationDocumentController();
