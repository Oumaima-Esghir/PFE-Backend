const moment = require('moment');
const Rate = require('../models/Rate_model'); // Chemin vers votre modèle Comment
const Pub = require('../models/Pub_model'); // Chemin vers votre modèle Pub
const User = require('../models/User_model')

// create rate
exports.createRate = async (req, res) => {
  const userId = req.user._id;
  const pubId = req.params.pubId;
  const { rate } = req.body;

  try {
    const user = await User.findById(userId);
 if (!user) {
  return res.json({ status: 'error', message: 'User not found' });
    }

    const pub = await Pub.findById(pubId);
    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const newRate = new Rate({
      userId,
      pubId,
      rate
    });

    const result = await newRate.save();

    pub.rates.push(newRate); 

    await pub.save();
    
    res.json({ status: 'success', data: result }); // Single response
  } catch (error) {
   if (!res.headersSent) {
   return res.status(500).json({ status: 'error', message: error.message });
   } else {
   console.error('Error sending response:', error.message);
   }
  }
  };
  
  //getrates
  exports.getPubRates = async (req, res) => {
    const pubId = req.params.pubId;
  
    try {
      const pub = await Pub.findById(pubId).populate('rates');// Populate comments
  
      if (!pub) {
        return res.status(404).json({ status: 'error', message: 'Publication not found' });
      }
  
      if (pub.rates.length === 0) {
        return res.status(200).json({ status: 'success', message: 'No rates found for this pub' }); // Send appropriate status code (200)
      }
  
      res.json({ status: 'success', data: pub.rates }); // Return rates within pub
    } catch (error) {
      console.error('Error fetching rates:', error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  };