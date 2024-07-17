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
    const pubId = req.params.pubId;
    const userId = req.user._id;
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
    const userId = req.user._id;  // Assuming you use 'userId' for both options
    const pubId = req.params.pubId; // Assuming you use 'pubId' for both options
  
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
    const userId = req.user._id;
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
     
  exports.uploadPicture =async (req, res) => {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({ status: 'error', message: 'User not found' });
      }
          if (req.file) {
            const imagepath = req.file.path.replace(/\\/g, "/").replace("images", "");
            res.json({ message: "ok!", imagepath: imagepath.replace("src/", "") });
          } else {
            res.json({ message: "Image not upload" });
          }
        } catch (error) {
          res.json({ message: "error", error });
        }    
      };

// // GET UserS
// exports.getUsers = async (req, res) => {
//     try {

//         const Users = await UserSchema.find({});
//         res.json({status:'success', data: Users});

//     }catch(error) {
//         res.json({status:'error', message: error})
//     }
// };

// // GET User BY ID
// exports.getUser = async (req, res) => {
//     const { id } = req.params;

//     // verfiy id 
//     if (!id || id == null ) {
//         res.json({status:'error', message: 'no id provided'});
//     }

//     try {
//         const User = await UserSchema.findById(id);

//         if (!User) {
//             res.json({status:'error', message: 'no User with that id  has been found'});
//         }

//         res.json({status:'success', data: User});
        
//     }catch(error) {
//         res.json({status:'error', message: error})
//     }
// };

// // CREATE User
// exports.postUser = async (req, res) => {
//     const { username, email, password } = req.body;

//     if(!username || !email || !password) {
//         res.json({status:'error', message: 'please provide all data'});
//     }

//     try {
        
//         const newUserObj = {
//             username,
//             email,
//             password
//         };

//         const newUser = new UserSchema(newUserObj);

//         const result = await newUser.save();

//         res.json({status:'success', data: result});
        
//     }catch(error) {
//         res.json({status:'error', message: error})
//     }
// };

// // DELETE User
// exports.deleteUser = async (req, res) => {
//     const { id } = req.params;

//     // verfiy id 
//     if (!id) {
//         res.json({status:'error', message: 'no id provided'});
//     }

//     const UserFound = await UserSchema.findById(id);
//     if(!UserFound) { res.json({status:'error', message: 'no User found by that id'}) }

//     try {
        
//         const result = await UserSchema.findByIdAndDelete(id);
//         res.json({status:'success', message: 'User deleted with success'});

//     }catch(error) {
//         res.json({status:'error', message: error})
//     }
// };

// UPDATE User
 exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const newPassword = req.body.password;

    if (newPassword) {
      // Générer le sel et hacher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Mettre à jour le candidat avec le nouveau mot de passe haché
      await model.findByIdAndUpdate(
        id,
        { password: hashedPassword },
        { new: true } // Retourner le document mis à jour
      );
    } else {
      // Si le mot de passe n'est pas modifié, mettre à jour les autres informations
      const updateUser = await model.findByIdAndUpdate(id, req.body);
      if (!updateUser) {
        return res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      }
    }

    res.status(201).json({ message: `User mis à jour avec succès` });
  } catch (error) {
    res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
// // SEARCH
// exports.searchUsers = async (req, res) => {
//     const { query } = req.query;
//     console.log(query)
  
//     if (!query) {
//       return res.json({ status: "error", message: "Please provide a search query" });
//     }
  
//     try {
//       // Parse the query string into a number
//       //const numPagesQuery = parseInt(query);
      
//       // Check if the parsing was successful and it's a valid number
//       const searchQuery = {
//         $or: [
//           { username: { $regex: query, $options: "i" } },
//           { password: { $regex: query, $options: "i" } },
//           { email: { $regex: query, $options: "i" } }, 
//           //{ numPages: isNaN(numPagesQuery) ? -1 : numPagesQuery } // Handle NaN case
//         ],
//       };
  
//       const users = await UserSchema.find(searchQuery);
  
//       if (users.length === 0) {
//         return res.json({ status: "error", message: "No users found" });
//       }
  
//       return res.json({ status: "success", data: users });
  
//     } catch (error) {
//       console.error("Error in searchUsers:", error); // Log the error for debugging
//       return res.json({ status: "error", message: "An error occurred during search" });
//     }
// };