const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Partenaire = require('../models/Partenaire_model'); // Path to your Partner model file
require('dotenv').config();// Path to your User model file

// Function to handle signup
exports.signup = async (req, res) => {
  try {
    const {email, name, adress, image, password } = req.body;

    // Hash the password directly in the signup function
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const partenaire = new Partenaire({
     email,
     name,
      adress,
      image,
      roles:["partenaire"],
      password: hashedPassword // Use the hashed password for partner creation
    });

    await partenaire.save();

    // Generate a token
    const token = jwt.sign({ userId: partenaire._id }, process.env.JWT_SECRET,);
res.status(201).json({
      message: 'Partner successfully created!',
      partenaire: {
        id: partenaire._id,
        name: partenaire.username,
        adress: partenaire.address,
        image: partenaire.image,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating partner', error: error.message });
  }
};