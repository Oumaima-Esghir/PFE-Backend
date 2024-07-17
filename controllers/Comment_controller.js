const commentSchema = require('../models/Comment_model')
const moment = require('moment');

// GET Comments
exports.getComments = async (req, res) => {
    try {

        const Comments = await commentSchema.find({});
        res.json({status:'success', data: Comments});

    }catch(error) {
        res.json({status:'error', message: error})
    }
};

// GET Comment BY ID
exports.getComment = async (req, res) => {
    const { id } = req.params;

    // verfiy id 
    if (!id || id == null ) {
        res.json({status:'error', message: 'no id provided'});
    }

    try {
        const Comment = await commentSchema.findById(id);

        if (!Comment) {
            res.json({status:'error', message: 'no Comment with that id  has been found'});
        }

        res.json({status:'success', data: Comment});
        
    }catch(error) {
        res.json({status:'error', message: error})
    }
};

// CREATE COMMENT
exports.postComment = async (req, res) => {
    const { idUser, idPub, text } = req.body;

    if(!idUser || !idPub || !text) {
        res.json({status:'error', message: 'please provide all data'});
    }

    try {
        
        const newCommentObj = {
            idUser,
            idPub,
            text
        };

        const newComment = new commentSchema(newCommentObj);

        const result = await newComment.save();

        res.json({status:'success', data: result});
        
    }catch(error) {
        res.json({status:'error', message: error})
    }
};