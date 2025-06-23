const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../middleware/auth');


// Get all schedules (accessible to authenticated users)
router.get('/', authenticate, scheduleController.getAllSchedules);

// Create a new schedule (only for station managers)
router.post('/', authenticate, authorize(['station_manager']), scheduleController.createSchedule);

module.exports = router;
