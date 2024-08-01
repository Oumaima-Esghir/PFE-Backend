const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User_model'); // Path to your User model file
require('dotenv').config();// Path to your User model file

// Function to handle signup
exports.signup = async (req, res) => {
  try {
    const {email, username, lastname, age, adress, image, password } = req.body;

    // Hash the password directly in the signup function
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
     email,
     username,
      lastname,
      age,
      adress,
      image,
      roles:["user"],
      password: hashedPassword // Use the hashed password for user creation
    });

    await user.save();

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET,);
res.status(201).json({
      message: 'User successfully created!',
      user: {
        id: user._id,
        username: user.username,
        lastname: user.lastname,
        age: user.age,
        adress: user.adress,
        image: user.image,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
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
       
        }
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).send("Refresh Token is required.");
    }
  
    // Assume refreshToken is stored in the user's document or in a separate token store
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const userId = decoded.userId;
  
      // Check if the refresh token belongs to a valid user and is not revoked
      const user = await User.findById(userId);
      // This check should ideally be against stored token values, this is simplified
      if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
        return res.status(403).send("Refresh token is not valid.");
      }
  
      // Issue a new access token and a new refresh token
      const newAccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
      // Update refresh token in the database or wherever it is stored
      user.refreshToken = newRefreshToken;
      await user.save();
  
      // Send the new tokens back to the client
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).send("Invalid Refresh Token.");
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).send("Refresh Token has expired.");
      }
      return res.status(500).send("Internal Server Error.");
    }
  };

  exports.logout = (res) => {
    try {
      res.clearCookie("jwt", { path: "/" });
      res.status(200).json({ message: "Success " });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };
  
  //add favorites
  exports.addToFavourites = async (req, res) => {
    const { userId, pubId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({ status: 'error', message: 'User not found' });
      }
  
      if (user.favouritePubs.includes(pubId)) {
        return res.json({ status: 'error', message: 'Pub already in favourites' });
      }
  
      user.favouritePubs.push(pubId);
      await user.save();
  
      return res.json({ status: 'success', message: 'Pub added to favourites' });
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  };
  
  //remove favorites
  exports.removeFromFavourites = async (req, res) => {
    // Extract user ID based on your chosen approach (query parameters or request body)
    const userId = req.query.userId || req.body.userId; // Assuming you use 'userId' for both options
    const pubId = req.query.pubId || req.body.pubId; // Assuming you use 'pubId' for both options
  
    if (!userId || !pubId) {
      return res.json({ status: 'error', message: 'Missing user ID or pub ID' });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({ status: 'error', message: 'User not found' });
      }
  
      const pubIndex = user.favouritePubs.indexOf(pubId);
      if (pubIndex === -1) {
        return res.json({ status: 'error', message: 'Pub not found in favourites' });
      }
  
      user.favouritePubs.splice(pubIndex, 1);
      await user.save();
  
      return res.json({ status: 'success', message: 'Pub removed from favourites' });
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  };
  
  //get favorites
  exports.getFavourites = async (req, res) => {
    console.log('Request received'); // Log 1
  
    // Extract user ID from the URL path
    const userId = req.params.userId;
    console.log(`Extracted user ID: ${userId}`); // Log 2
  
    try {
      const user = await User.findById(userId);
      console.log(`User found: ${user ? 'Yes' : 'No'}`); // Log 3
      if (!user) {
        return res.json({ status: 'error', message: 'User not found' });
      }
  
      return res.json({ status: 'success', data: user.favouritePubs });
    } catch (error) {
      console.error(error); // Log any errors
      return res.json({ status: 'error', message: error.message });
    }
  };

  //update user
  exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    // Vérifiez si l'ID est fourni
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'No ID provided' });
    }
  
    try {
      // Mettez à jour l'utilisateur et obtenez le document mis à jour
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  
      // Si aucun utilisateur n'est trouvé pour cet ID
      if (!updatedUser) {
        return res.status(404).json({ status: 'error', message: 'User not found by that ID' });
      }
  
      // Répondez avec le document utilisateur mis à jour
      res.status(200).json({ status: 'success', message: 'User updated successfully', data: updatedUser });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

     
