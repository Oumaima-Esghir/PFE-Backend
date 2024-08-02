const moment = require('moment');
const Rate = require('../models/Rate_model'); // Chemin vers votre modèle Comment
const Pub = require('../models/Pub_model'); // Chemin vers votre modèle Pub

// create rate
exports.createRate = async (req, res) => {
    const { pubId, rate } = req.body; // LE pubId doit être passé dans le corps de la requête
  
    try {
      // Vérifiez si la publication existe
      const pub = await Pub.findById(pubId);
      if (!pub) {
        return res.status(404).json({ message: "Publication not found" });
      }
  
      // Créer un nouveau rate
      const rate = new Rate({
        user: req.userId, // ID du user connecté (authentifié)
        pubId: pubId, // stockez le pubId dans le rate
        rate
      });
  
      // Enregistrez le rate
      await rate.save();
  
      // Ajoutez le rate à la publication (facultatif)
      pub.rates.push(rate._id);
      await pub.save();
  
      res.status(201).json({ message: "Rate created successfully", rate });
    } catch (error) {
      res.status(500).json({ message: "Error creating rate", error: error.message });
    }
  };