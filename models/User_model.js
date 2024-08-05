const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Personne = require('./Personne_model'); // Correction de l'importation du modèle `User`
const Plan = require('./Plan_model')
const Pub = require('./Pub_model')
const Conversation = require('./Conversation_model')



const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
      required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  favouritePubs: [{ type: Schema.Types.ObjectId, ref: 'Pub' }],  

  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],  

  planifications: [{ type: Schema.Types.ObjectId, ref: 'Plan' }],  
});

const User = Personne.discriminator('User', userSchema);

module.exports = User;