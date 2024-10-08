const express = require('express');
const router = express.Router()
const PubController = require('../controllers/Pub_controller');

const multer = require('multer'); // Import multer
const path = require('path'); 
const { isAuth } = require('../middlewares/auth');


// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images'); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });



router.post('/', isAuth, upload.single('pubImage'), PubController.createPub);

router.get('/',upload.single('pubImage'), PubController.getAllPubs);

router.get('/:pubId', PubController.getPubById);

router.put('/:pubId', isAuth, upload.single('pubImage'), PubController.updatePub);

router.delete('/delete/:pubId', isAuth, PubController.deletePub);


module.exports = router;