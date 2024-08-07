const express = require('express');
const router = express.Router()
const UserController = require('../controllers/User_controller');
const multer = require('multer'); // Import multer
const path = require('path');
const {isAuth} = require('../middlewares/auth.js')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });


router.post('/signup', UserController.signup);

router.post('/signin', UserController.signin);

router.put('/update', upload.single('image'), isAuth, UserController.updateUser); 

router.post('/refresh-token', UserController.refreshToken);

router.post('/favourites/add/:pubId', isAuth, UserController.addToFavourites); // POST for creating a new favourite

router.delete('/favourites/remove/:pubId', isAuth, UserController.removeFromFavourites); // DELETE for removing a favourite

router.get('/favourites', isAuth, UserController.getFavourites); 


module.exports = router;