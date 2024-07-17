const express = require('express');
const router = express.Router()
const RateController = require('../controllers/Rate_controller');

// GET Rates
router.get('/', RateController.getRates)

// GET Rate BY ID
//router.get('/:id', RateController.getRate)

// CREATE Rate
router.post('/', RateController.postRate)

module.exports = router;