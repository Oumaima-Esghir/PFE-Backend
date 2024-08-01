const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const PlanSchema = new mongoose.Schema({
userId: {
 type: Schema.Types.ObjectId,
  ref: 'User',
 },
 pubId: {
  type: Schema.Types.ObjectId,
  ref: 'pub',
 },
  title: {
    type: String,
    required: true,
   },
   dateFrom: {
    type: String,
    required: true,
   },
   dateTo: {
    type: String,
    required: true,
   },
   timeFrom: {
    type: String,
    required: true,
   },
   timeTo: {
    type: String,
    required: true,
   },
   nb_persons: {
    type: Number,
    required: true,
   },
   reminder: {
    type: String,
    required: true,
   },
  createdAT: {
    type: String,
    default: moment(new Date()).format('DD/MM/YYYY hh:mm'),
    required : false
  }, 
});

module.exports = mongoose.model('plans', PlanSchema)