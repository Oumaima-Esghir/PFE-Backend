// conversation.js

const express = require('express');
const router = express.Router();
const {isAuth} = require('../middlewares/auth.js')
const chatController = require('../controllers/Conversation_controller.js'); 


router.post('/handleMessage/:conversationId?', isAuth, chatController.handleMessage); 
router.delete('/deleteConversation/:conversationId', isAuth, chatController.deleteConversation);
router.get('/getConversations', isAuth, chatController.getConversations);
router.get('/getConversation/:conversationId', isAuth, chatController.getConversation);

module.exports = router;