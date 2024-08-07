const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/Comment_controller'); 
const { isAuth } = require('../middlewares/auth'); // Middleware pour vérification de l'authentification

// Route pour créer un commentaire
router.post('/:pubId', isAuth, CommentController.createComment); // Expects { pubId, text }

// Route pour obtenir tous les commentaires d'une publication
router.get('/:pubId', CommentController.getAllCommentsByPub);

module.exports = router;