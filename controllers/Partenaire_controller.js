const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Partenaire = require('../models/Partenaire_model'); // Path to your User model file
const Pub = require('../models/Pub_model');
require('dotenv').config();// Path to your User model file

// signup partenaire
exports.signup = async (req, res) => {
  try {
    const {email, name,  adress, image, password } = req.body;

    // Hash the password directly in the signup function
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Partenaire({
     email,
     name,
      adress,
      image,
      roles:["partenaire"],
      password: hashedPassword // Use the hashed password for user creation
    });

    await user.save();

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,);
res.status(201).json({
      message: 'User successfully created!',
      user: {
        id: user._id,
        name: user.name,
        adress: user.adress,
        image: user.image,
        token,
        roles:["partenaire"],
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

 //signin partenaire
exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await Partenaire.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
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
          roles:["partenaire"],
       
        }
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  //update partenaire
  exports.updatePartenaire = async (req, res) => {
    //const { id } = req.params; // Assume we're passing the Partenaire ID via the URL params
    const updateData = req.body;
  
    if(req.file) {
      updateData.image = req.file.path.replace(/\\/g, "/").replace("images", "").replace("src/", "");
    }
  
    // Hash le mot de passe, si fourni
    if(updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
  
    try {
      const updatedPartenaire = await Partenaire.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  
      if(!updatedPartenaire) {
        return res.status(404).json({ message: "Partenaire not found" });
      }
  
      res.status(200).json({
        message: "Partenaire updated successfully",
        partenaire: {
         // id: updatedPartenaire._id,
          name: updatedPartenaire.name,
          adress: updatedPartenaire.adress,
          image: updatedPartenaire.image,
          // Ajoutez les autres champs que vous souhaitez retourner
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating Partenaire", error: error.message });
    }
  };

  exports.getPubs = async (req , res) => {
    try {
      const partenaireId = req.user._id;
      console.log(partenaireId)
      const pubs = await Pub.find({partenaire: partenaireId});
      console.log({pubs})
      res.status(200).json({pubs});
    } catch (error) {
      res.status(500).json({msg:'erreur',error:error.msg})
    }
  };
  
 
 
     
