const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes in this file are protected and require authentication
router.use(authenticate);

// Routes accessible to agency_admin and system_admin
router.use(authorize(['agency_admin', 'system_admin']));

router.post('/by-agency/:agencyId', routeController.createRoute);
router.get('/by-agency/:agencyId', routeController.getAgencyRoutes);
router.get('/by-agency/:agencyId/stats', routeController.getAgencyRoutesStats);
router.get('/:id', routeController.getRouteById);
router.put('/:id', routeController.updateRoute);
router.delete('/:id', routeController.deleteRoute);

module.exports = router;
