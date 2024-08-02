const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PubSchema = new mongoose.Schema({
    pubImage: {
        type: String,
        
      },
      title: {
        type: String,
        
      },
      description: {
        type: String,
        
      },
      adress: {
        type: String,
        
      },
      
      category: {
        type: String,
        
        enum: [
          "hotel",
          "restaurant",
          "cafe",
          "park",
          "destination",
          "beach",
          "monument"
        ],
      },
      state: {
        type: String,
        enum: ["offre", "promo"],
        default: "offre",
      },
    createdAT: {
        type: String,
        default: moment(new Date()).format('DD/MM/YYYY hh:mm'),
        required : false
    },
    //promo
     duree: {
        type: String,
        
      },
      pourcentage: {
        type: Number,
        
      },
      isvalidated: {
        type: Boolean,
        default: null,
      },
      partenaire: { type: Schema.Types.ObjectId, ref: 'Partenaire'},
      comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], 
      rates: [{ type: Schema.Types.ObjectId, ref: 'Rate' }], 
});

module.exports = mongoose.model('pub', PubSchema)

