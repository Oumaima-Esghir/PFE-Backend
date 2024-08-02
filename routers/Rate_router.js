const express = require('express');
const router = express.Router()
const RateController = require('../controllers/Rate_controller');
const { isAuth } = require('../middlewares/auth'); // Middleware pour vérification de l'authentification

// Route pour créer un rate
router.post('/', isAuth, RateController.createRate); // Expects { pubId, text }

module.exports = router;