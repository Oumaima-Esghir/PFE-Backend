const express = require('express');
const router = express.Router()
const {isAuth} = require('../middlewares/auth.js')
const checkRole = require('../middlewares/role.js')
const PlanController = require('../controllers/Plan_controller');

// GET PLANS
router.get('/', PlanController.getPlans)

//GET PLAN BY ID
router.get('/getid/:planId', isAuth, PlanController.getPlanById);

// GET USER PLAN
router.get('/get', isAuth, PlanController.getPlan)

// CREATE PLAN
router.post('/add/:pubId', isAuth, PlanController.postPlan)

// DELETE PLAN
router.delete('/delete/:planId', isAuth, PlanController.deletePlan)

// UPDATE PLAN
router.put('/update/:planId', isAuth, PlanController.updatePlan)

// SHARE PLAN
router.get('/:id', PlanController.sharePlan)




module.exports = router;

