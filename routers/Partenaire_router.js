const express = require('express');
const router = express.Router()
const PartenaireController = require('../controllers/Partenaire_controller');
const multer = require('multer'); // Import multer
const path = require('path'); 
const { isAuth } = require('../middlewares/auth');




  const storageLocal = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({ storage: storageLocal });

router.post('/signup', PartenaireController.signup);

router.post('/signin', PartenaireController.signin);

router.put('/update', upload.single('image'),isAuth, PartenaireController.updatePartenaire); 

router.get ('/pubs' ,isAuth, PartenaireController.getPubs);

module.exports = router;