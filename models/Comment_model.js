const moment = require('moment');
const mongoose = require("mongoose");
const User = require('./User_model'); 
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  PubId: { type: Schema.Types.ObjectId, ref: 'Pub',require: true},
  text: {
    type: String,
    require: true,
  },
  createdAT: {
    type: String,
    default: moment(new Date()).format('DD/MM/YYYY hh:mm'),
    required : false
}
  ,});
  module.exports = mongoose.model('comment', commentSchema)