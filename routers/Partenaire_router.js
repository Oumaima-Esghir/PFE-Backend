const express = require('express');
const router = express.Router()
const PartenaireController = require('../controllers/Partenaire_controller');


router.post('/signup', PartenaireController.signup);

router.post('/signin', PartenaireController.signin);

//router.post('/refresh-token', UserController.refreshToken);

//router.post('/favourites/add', UserController.addToFavourites); // POST for creating a new favourite

//router.delete('/favourites/remove', UserController.removeFromFavourites); // DELETE for removing a favourite

//router.get('/favourites/:userId', UserController.getFavourites); // Use userId to identify user

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