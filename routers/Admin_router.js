const express = require('express');
const router = express.Router()
const AdminController = require('../controllers/Admin_controller');
const multer = require('multer');
const path = require('path');

const { isAuth } = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


// Ajout du middleware isAdmin pour sécuriser les routes d'administration

router.post('/signin', AdminController.signin);

// get users
router.get('/users', AdminController.getAllUsers);

router.get('/users/:userId', AdminController.getUserById);

// get partners 
router.get('/partners', AdminController.getAllPartners);

router.get('/partners/:partnerId', AdminController.getPartnerById);

//get pubs
router.get('/pubs', AdminController.getAllPubs);

router.get('/pubs/:pubId',AdminController.getPubById);

//update and validate pub
router.put('/pubs/:pubId',upload.single('pubImage'), AdminController.updatePub);

// delete a user
router.delete('/users/delete/:userId', AdminController.deleteUser);

//  delete a partner
router.delete('/partners/delete/:partnerId', AdminController.deletePartner);



module.exports = router;