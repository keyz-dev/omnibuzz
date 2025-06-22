const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes in this file are protected and require authentication
router.use(authenticate);

// Routes accessible to agency_admin and system_admin
router.use(authorize(['agency_admin', 'system_admin']));

router.post('/agency', routeController.createRoute);
router.get('/agency', routeController.getAgencyRoutes);
router.get('/agency/:id', routeController.getRouteById);
router.put('/agency/:id', routeController.updateRoute);
router.delete('/agency/:id', routeController.deleteRoute);

module.exports = router;
