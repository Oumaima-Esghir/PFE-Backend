const moment = require('moment');
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  idUser: {
    type: String,
    require: true,
  },
  idPub: {
    type: String,
    require: true,
  }, 
    title: {
        type: String,
        require: true,
      },
      dateFrom: {
        type: String,
        require: true,
      },
      dateTo: {
        type: String,
        require: true,
      },
      timeFrom: {
        type: String,
        require: true,
      },
      timeTo: {
        type: String,
        require: true,
      },
      nb_persons: {
        type: Number,
        require: true,
      },
      reminder: {
        type: String,
        require: true,
      },
    createdAT: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY hh:mm'),
        required : false
    },  
});

module.exports = mongoose.model('plans', PlanSchema)