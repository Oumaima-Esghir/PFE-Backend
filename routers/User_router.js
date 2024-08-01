const express = require('express');
const router = express.Router()
const UserController = require('../controllers/User_controller');
const {isAuth} = require('../middlewares/auth.js')

router.post('/signup', UserController.signup);

router.post('/signin', UserController.signin);

router.put('/update/:id',isAuth, UserController.updateUser);

router.post('/refresh-token', UserController.refreshToken);

router.post('/favourites/add', UserController.addToFavourites); // POST for creating a new favourite

router.delete('/favourites/remove', UserController.removeFromFavourites); // DELETE for removing a favourite

router.get('/favourites/:userId', UserController.getFavourites); // Use userId to identify user

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