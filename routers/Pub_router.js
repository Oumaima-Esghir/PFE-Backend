const express = require('express');
const router = express.Router()
const {isAuth} = require('../middlewares/auth.js')
const PubController = require('../controllers/Pub_controller');

// GET PUBS
router.get('/', PubController.getPubs)

// GET PUB BY ID
router.get('/:id', PubController.getPub)

// CREATE PUB
router.post('/', isAuth, PubController.postPub)

// DELETE PUB
router.delete('/:id', PubController.deletePub)

// UPDATE PUB
router.put('/:id', PubController.updatePub)

// SEARCH
router.post('/search', PubController.searchPubs)


module.exports = router;