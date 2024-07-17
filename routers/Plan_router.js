const express = require('express');
const router = express.Router()
const PlanController = require('../controllers/Plan_controller');

// GET PLANS
router.get('/', PlanController.getPlans)

// GET PLAN BY ID
//router.get('/:id', PlanController.getPlan)

// CREATE PLAN
router.post('/', PlanController.postPlan)

// DELETE PLAN
router.delete('/:id', PlanController.deletePlan)

// UPDATE PLAN
router.put('/:id', PlanController.updatePlan)

// SHARE PLAN
router.get('/:id', PlanController.sharePlan)

// SEARCH
router.post('/search', PlanController.searchPlans)


module.exports = router;