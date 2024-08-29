require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require('../models/Admin_model');
const User = require('../models/User_model');
const Partenaire = require('../models/Partenaire_model');
const Pub = require('../models/Pub_model')

//signin admin
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate an access token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
     // { expiresIn: '90d' }
    );

   
    // You might want to save the refreshToken with the user's record in the database
    // This is a simplified version without refresh token storage
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        token: token,
        roles:["admin"],
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

//get user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

//get all pubs
exports.getAllPubs = async (req, res) => {
  try {
    const pubs = await Pub.find();
    res.status(200).json(pubs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching publications", error: error.message });
  }
};

//get pub by id
exports.getPubById = async (req, res) => {
  try {
    const pub = await Pub.findById(req.params.pubId);
    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.status(200).json(pub);
  } catch (error) {
    res.status(500).json({ message: "Error fetching publication", error: error.message });
  }
};

//update & validate pub
exports.updatePub = async (req, res) => {
  try {
    const updateData = req.body;
 
    if (req.file) {
      updateData.pubImage = req.file.path.replace(/\\/g, "/").replace("images", "").replace("src/", "");
    }
 
    const pub = await Pub.findByIdAndUpdate(req.params.pubId, updateData, { new: true, runValidators: true });
 
    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }
 
    res.status(200).json({ message: "Publication updated successfully", pub });
  } catch (error) {
    res.status(500).json({ message: "Error updating publication", error: error.message });
  }
};

// get all partners
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partenaire.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partners', error: error.message });
  }
};

// get partner by id
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partenaire.findById(req.params.partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: "Error fetching partner", error: error.message });
  }
};

// Delete user by id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
// Delete partner by id
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partenaire.findByIdAndDelete(req.params.partnerId);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting partner", error: error.message });
  }
};
