const express = require('express');
const router = express.Router();
const journeyPlanController = require('../controllers/journeyPlanController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, journeyPlanController.getAllJourneyPlans);
router.post('/', auth, journeyPlanController.createJourneyPlan);
router.put('/:id', auth, journeyPlanController.updateJourneyPlan);
router.delete('/:id', auth, journeyPlanController.deleteJourneyPlan);

module.exports = router;
