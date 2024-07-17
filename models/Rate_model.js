const moment = require('moment');
const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  idUser: {
    type: String,
    require: true,
  },
  idPub: {
    type: String,
    require: true,
  },
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