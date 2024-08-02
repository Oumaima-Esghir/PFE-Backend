const moment = require('moment');
const mongoose = require("mongoose");
const User = require('./User_model'); 
const Schema = mongoose.Schema;

const rateSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  PubId: { type: Schema.Types.ObjectId, ref: 'Pub'},
  createdAT: {
    type: String,
    default: moment(new Date()).format('DD/MM/YYYY hh:mm'),
    required : false
},
  rate: {
    type: Number,
    require: true,
  }
  ,});
  module.exports = mongoose.model('rate', rateSchema)