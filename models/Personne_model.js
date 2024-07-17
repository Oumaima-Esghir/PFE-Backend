// const moment = require('moment');
// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     imagePath: {
//         type: String,
//         require: true,
//         default: "/defaultprofil.png",
//       },
//       username: {
//         type: String,
//         require: true,
//       },
//       lastname: {
//         type: String,
//         require: true,
//       },
//       birthdate: {
//         type: Date,
//         require: true,
//       },
//       tel: {
//         type: Number,
//         require: true,
//       },
//       email: {
//         type: String,
//         unique: true,
//         require: true,
//       },
//       password: {
//         type: String,
//         require: true,
//       },
//       adress: {
//         type: String,
//         require: true,
//       },
//       age: {
//         type: Number,
//         require: true,
//       },
//       gender: {
//         type: Boolean,
//         default: false,
//       },
//       /*favouritePlaces: {
//         type: Array<Pub>
//       },*/
//       isverified: {
//         type: Boolean,
//         default: false,
//       }, 
//       role: {
//         type: String,
//         enum: ["user", "partner", "admin"],
//         default: "user",
//       },
//       //partner
//       partnername: {
//         type: String,
//         require: true,
//       },
//       resetToken: { type: String },
// });

// module.exports = mongoose.model('users', UserSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const personneSchema = new Schema({
 email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() { return this.authMethod === 'local'; },
  },
  authMethod: {
    type: String,
    required: true,
    enum: ['local', 'google'],
    default: 'local'
  },
  roles: {
    type: [String],
    enum: ["user", "admin", "partenaire", "personne"],
    default: ["personne"],
  }
}, { discriminatorKey: 'personneType', collection: 'personnes' });

const Personne= mongoose.model('Personne', personneSchema);

module.exports = Personne;