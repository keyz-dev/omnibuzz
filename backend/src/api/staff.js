const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { authenticate, authorize } = require("../middleware/auth");
const { isAgencyAdmin } = require("../middleware/agencyAuth");

router.use(authenticate)

// Get all staff for an agency
router.get("/by-agency/:agencyId", isAgencyAdmin, staffController.getAllByAgency);

// Get staff statistics for an agency
router.get("/by-agency/:agencyId/stats", isAgencyAdmin, staffController.getStats);

// Create a new staff member (invite)
router.post("/", authorize(['agency_admin']), staffController.create);

// Update a staff member's details
router.put("/:workerId", isAgencyAdmin, staffController.update);

// Delete a staff member
router.delete("/:workerId", isAgencyAdmin, staffController.remove);

// Resend invitation to a staff member
router.post("/:workerId/resend-invite", isAgencyAdmin, staffController.resendInvite);

module.exports = router;