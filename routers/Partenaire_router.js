const express = require('express');
const router = express.Router()
const PartenaireController = require('../controllers/Partenaire_controller');
const multer = require('multer'); // Import multer
const path = require('path'); 
const { isAuth } = require('../middlewares/auth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });



router.post('/signup', PartenaireController.signup);

router.post('/signin', PartenaireController.signin);

router.put('/update/:id', upload.single('image'),isAuth, PartenaireController.updatePartenaire); 

router.get ('/' ,isAuth, PartenaireController.getPubs);

module.exports = router;