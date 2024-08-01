const moment = require('moment');
const Comment = require('../models/Comment_model'); // Chemin vers votre modèle Comment
const Pub = require('../models/Pub_model'); // Chemin vers votre modèle Pub

// Méthode pour créer un commentaire
exports.createComment = async (req, res) => {
    const { pubId, text } = req.body; // LE pubId doit être passé dans le corps de la requête
  
    try {
      // Vérifiez si la publication existe
      const pub = await Pub.findById(pubId);
      if (!pub) {
        return res.status(404).json({ message: "Publication not found" });
      }
  
      // Créer un nouveau commentaire
      const comment = new Comment({
        user: req.userId, // ID du user connecté (authentifié)
        pubId: pubId, // stockez le pubId dans le commentaire
        text
      });
  
      // Enregistrez le commentaire
      await comment.save();
  
      // Ajoutez le commentaire à la publication (facultatif)
      pub.comments.push(comment._id);
      await pub.save();
  
      res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
      res.status(500).json({ message: "Error creating comment", error: error.message });
    }
  };
  exports.getAllCommentsByPub = async (req, res) => {
    const { pubId } = req.params; // Récupérez l'ID de la publication depuis les paramètres de la requête
  
    try {
      // Vérifiez si la publication existe
      const pub = await Pub.findById(pubId);
      if (!pub) {
        return res.status(404).json({ message: "Publication not found" });
      }
  
      // Trouvez tous les commentaires associés à cette publication
      const comments = await Comment.find( {pubId }); // Assurez-vous d'utiliser pubId ici
  
      console.log(comments); // Confirmez les commentaires retournés
  
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error:', error); // Journaliser les erreurs
      res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
  };