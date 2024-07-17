const express = require('express');
const router = express.Router()
const {isAuth} = require('../middlewares/auth.js')
const UserController = require('../controllers/User_controller');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path

// upload image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });

router.post("/upload", isAuth ,upload.single("image"),UserController.uploadPicture);

  
router.post('/signup', UserController.signup);

router.post('/signin', UserController.signin);

router.post('/refresh-token', UserController.refreshToken);

router.post('/favourites/add/:pubId', isAuth, UserController.addToFavourites); // POST for creating a new favourite

router.delete('/favourites/remove/:pubId', isAuth, UserController.removeFromFavourites); // DELETE for removing a favourite

router.get('/favourites',isAuth, UserController.getFavourites); // Use userId to identify user

// // GET UserS
// router.get('/', UserController.getUsers)

// // GET User BY ID
// router.get('/:id', UserController.getUser)

// // CREATE User
// router.post('/', UserController.postUser)

// // DELETE User
// router.delete('/:id', UserController.deleteUser)

// // UPDATE User
// router.put('/:id', UserController.updateUser)

// // SEARCH
// router.post('/search', UserController.searchUsers)


module.exports = router;