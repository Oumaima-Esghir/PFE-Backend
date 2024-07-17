const express = require('express');
const router = express.Router()
const CommentController = require('../controllers/Comment_controller');

// GET Comments
router.get('/', CommentController.getComments)

// GET Comment BY ID
router.get('/:id', CommentController.getComment)

// CREATE Comment
router.post('/', CommentController.postComment)

module.exports = router;