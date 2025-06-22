const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middleware/auth');
const { bulkUpload } = require('../middleware/uploadMiddleware');

router.use(authenticate);
router.get('/all', busController.getAll);

router.use(authorize(['agency_admin', 'system_admin']));

router.get('/by-agency/:agencyId', busController.getAgencyBuses);
router.get('/stats/by-agency/:agencyId', busController.getBusStatsByAgency);
router.get('/:id', busController.getBusById);
router.post('/bulk-import', bulkUpload.single('file'), busController.bulkImportBuses);
router.post('/', busController.createBus);
router.put('/:id', busController.updateBus);
router.delete('/:id', busController.deleteBus);


module.exports = router;
