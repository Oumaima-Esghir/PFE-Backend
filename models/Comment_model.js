const moment = require('moment');
const mongoose = require("mongoose");
const User = require('./User_model'); 
const Pub = require('./Pub_model')
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  pubId: {
    type: Schema.Types.ObjectId,
    ref: 'pub',
  },
  text: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    default: moment(new Date()).format('DD/MM/YYYY hh:mm'),
    required: false
  }
});

module.exports = mongoose.model('comment', commentSchema);
