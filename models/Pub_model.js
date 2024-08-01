const moment = require('moment');
const mongoose = require('mongoose');

const PubSchema = new mongoose.Schema({
    pubImage: {
        type: String,
        require: true,
      },
      title: {
        type: String,
        require: true,
      },
      description: {
        type: String,
        require: true,
      },
      adress: {
        type: String,
        require: true,
      },
      rating: {
        type: Number,
        require: true,
      },
      nb_likes: {
        type: Number,
        require: true,
      },
      category: {
        type: String,
        require: true,
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
        enum: ["offre", "promo", "plan"],
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
        require: true,
      },
      pourcentage: {
        type: Number,
        require: true,
      },
      isvalidated: {
        type: Boolean,
        default: false,
      }, 

});

module.exports = mongoose.model('pubs', PubSchema)

//userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },