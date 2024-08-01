const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Personne = require('./Personne_model'); // Correction de l'importation du modèle `User`
const Pub =require('./Pub_model')


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
  },
 publications: [{ type: Schema.Types.ObjectId, ref: 'Pub' }],  
});

const Partenaire = Personne.discriminator('Partenaire', partenaireSchema);

module.exports = Partenaire;