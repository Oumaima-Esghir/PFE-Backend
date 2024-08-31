const moment = require('moment');
const mongoose = require('mongoose');
const Rate = require('./Rate_model')
const Comment = require('./Comment_model')
const Partenaire = require('./Partenaire_model')
const Schema = mongoose.Schema;

const PubSchema = new mongoose.Schema({

  partenaireId: {
    type: Schema.Types.ObjectId,
     ref: 'Partenaire',
    },
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
      rating: {
        type: Number,
        default: 0, // Initial rating value
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
      
      comments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
      rates: [{ type: Schema.Types.ObjectId, ref: 'rate' }], 
});

PubSchema.pre('save', async function (next) {
  const pub = this; // refers to the Pub document being saved

  // Calculate average rating using aggregation
  const [averageRate] = await Rate.aggregate([
    { $match: { pubId: pub._id } }, // Filter rates for this pub
    { $group: { _id: null, averageRating: { $avg: '$rate' } } }, // Calculate average
  ]);

  // Update rating field with the calculated average (or default to 0)
  pub.rating = averageRate?.averageRating || 0;

  next(); // Continue with the save operation
});

module.exports = mongoose.model('pub', PubSchema);

