require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const nodemailer = require("nodemailer");
const authController = require('../controllers/User_controller.js');
const Admin = require('../models/Admin_model');
//const { errorMonitor } = require("nodemailer/lib/xoauth2");

 exports.authenticate = async (data, role, res) => {
    try {
      const admin = await model.findOne({ mail: data.mail });
  
      if (!admin) {
        return res.status(404).json({ message: `${role} not found` });
      }
  
      const isPasswordValid = bcrypt.compare(data.password, admin.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
      }
  
      const adminWithoutPassword = admin.toJSON();
      delete adminWithoutPassword.password;
  
      // Generate JWT
      const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
  
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({ message: "Successfully Logged In" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
  };

  exports.logoutAdmin = (req, res) => {
    authController.logout(res);
  };
  
  exports.updateAdmin = async (req, res) => {
    authController.updateUser(req, "Admin", res);
  };