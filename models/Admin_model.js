const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Personne = require('./Personne_model'); // Correction de l'importation du modèle `User`



const adminSchema = new Schema({
  adminname: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },
   
});

const Admin = Personne.discriminator('Admin', adminSchema);

module.exports = Admin;