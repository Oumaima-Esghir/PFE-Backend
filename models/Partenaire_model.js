const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Personne = require('./Personne'); // Correction de l'importation du modèle `User`



const partenaireSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  adress: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  }
});

const Partenaire = Personne.discriminator('Partenaire', partenaireSchema);

module.exports = Partenaire;