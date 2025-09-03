const express = require('express');
const router = express.Router();
const travelLogController = require('../controllers/travelLogsController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, travelLogController.getAllTravelLogs);
router.post('/', auth, travelLogController.createTravelLog);
router.put('/:id', auth, travelLogController.updateTravelLog);
router.delete('/:id', auth, travelLogController.deleteTravelLog);

module.exports = router;
