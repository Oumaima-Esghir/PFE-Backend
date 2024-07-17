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
        email:partenaire.email,
        name: partenaire.username,
        adress: partenaire.address,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating partner', error: error.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const partenaire = await Partenaire.findOne({ email });
    if (!partenaire) {
      return res.status(404).json({ message: "partenaire not found" });
    }

    const isMatch = await bcrypt.compare(password, partenaire.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate an access token
    const token = jwt.sign(
      { partenaireId: partenaire._id },
      process.env.JWT_SECRET,
     // { expiresIn: '90d' }
    );

   
    // You might want to save the refreshToken with the user's record in the database
    // This is a simplified version without refresh token storage
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: partenaire._id,
        email: partenaire.email,
        token: token,
     
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};