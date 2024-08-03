const express = require('express');
const router = express.Router()
const {isAuth} = require('../middlewares/auth.js')
const checkRole = require('../middlewares/role.js')
const PlanController = require('../controllers/Plan_controller');

// GET PLANS
router.get('/', PlanController.getPlans)

// GET USER PLAN
router.get('/get', isAuth, PlanController.getPlan)

// CREATE PLAN
router.post('/add/:planId', isAuth, PlanController.postPlan)

// DELETE PLAN
router.delete('/delete/:planId', isAuth, PlanController.deletePlan)

// UPDATE PLAN
router.put('/update/:id', isAuth, PlanController.updatePlan)

// SHARE PLAN
router.get('/:id', PlanController.sharePlan)




module.exports = router;

