const express = require('express');
const router = express.Router()
const RateController = require('../controllers/Rate_controller');
const { isAuth } = require('../middlewares/auth'); // Middleware pour vérification de l'authentification

// Route pour créer un rate
router.post('/:pubId', isAuth, RateController.createRate); // Expects { pubId, text }

router.get('/:pubId', RateController.getPubRates);

module.exports = router;
