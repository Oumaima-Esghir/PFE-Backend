const moment = require('moment');
const Comment = require('../models/Comment_model'); // Ensure correct path
const Pub = require('../models/Pub_model');
const User = require('../models/User_model')

// create commment
exports.createComment = async (req, res) => {
  const userId = req.user._id;
  const pubId = req.params.pubId;
  const { text } = req.body;

  try {
    const user = await User.findById(userId);
 if (!user) {
  return res.json({ status: 'error', message: 'User not found' });
    }

    const pub = await Pub.findById(pubId);
    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const newComment = new Comment({
      userId,
      pubId,
      text
    });

    const result = await newComment.save();

    pub.comments.push(newComment); 

    await pub.save();
    
    res.json({ status: 'success', data: result }); // Single response
  } catch (error) {
   if (!res.headersSent) {
   return res.status(500).json({ status: 'error', message: error.message });
   } else {
   console.error('Error sending response:', error.message);
   }
  }
  };

  //getAllComments
  exports.getAllCommentsByPub = async (req, res) => {
    const pubId = req.params.pubId;
  
    try {
      const pub = await Pub.findById(pubId)// Populate comments
  
      if (!pub) {
        return res.status(404).json({ status: 'error', message: 'Publication not found' });
      }
  
      if (pub.comments.length === 0) {
        return res.status(200).json({ status: 'success', message: 'No comments found for this pub' }); // Send appropriate status code (200)
      }
  
      res.json({ status: 'success', data: pub.comments }); // Return comments within pub
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  };
  