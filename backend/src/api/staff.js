const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate)

// Get all staff for an agency
router.get("/by-agency/:agencyId", authorize(['agency_admin']), staffController.getAllByAgency);

// Get staff statistics for an agency
router.get("/by-agency/:agencyId/stats", authorize(['agency_admin']), staffController.getStats);

// Create a new staff member (invite)
router.post("/", authorize(['agency_admin']), staffController.create);

// Update a staff member's details
router.put("/:workerId", authorize(['agency_admin']), staffController.update);

// Delete a staff member
router.delete("/:workerId", authorize(['agency_admin']), staffController.remove);

// Resend invitation to a staff member
router.post("/:workerId/resend-invite", authorize(['agency_admin']), staffController.resendInvite);

module.exports = router;    