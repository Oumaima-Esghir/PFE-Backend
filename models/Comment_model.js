const moment = require('moment');
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  idUser: {
    type: String,
    require: true,
  },
  idPub: {
    type: String,
    require: true,
  },
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