const Pub = require('../models/Pub_model');
const Partenaire = require('../models/Partenaire_model');
const Personne = require('../models/Personne_model');
const multer = require('multer');


exports.createPub = async (req, res) => {
    try {
      const partenaireId = req.user._id;
      const { title, description, adress, rating, nb_likes, category, state, duree, pourcentage } = req.body;
      const partenaire = await Partenaire.findById(partenaireId);
  
      if (!partenaire) {
        return res.status(404).json({ message: "Partenaire not found" });
      }
  
      let pubData = {
        pubImage: req.file ? req.file.path.replace(/\\/g, "/").replace("images", "").replace("src/", "") : "",
        title,
        description,
        adress,
        rating,
        nb_likes,
        category,
        state,
        partenaireId,
      };
  
      if (state === 'promo') {
        pubData.duree = duree;
        pubData.pourcentage = pourcentage;
      }
  
      const pub = new Pub(pubData);
  
      await pub.save();
  
      partenaire.publications.push(pub._id);
      await partenaire.save();
  
      res.status(201).json({ message: "Publication created successfully", pub });
    } catch (error) {
      res.status(500).json({ message: "Error creating publication", error: error.message });
    }
  };

  exports.getAllPubs = async (req, res) => {
    try {
      const pubs = await Pub.find();
      
      // Transform the array of pub documents
      const transformedPubs = pubs.map(pub => ({
        id: pub._id.toString(),
        ...pub.toObject(), // Convert Mongoose document to plain JavaScript object
      }));
  
      // Send the transformed array as a response
      res.status(200).json(transformedPubs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching publications", error: error.message });
    }
  };
  


exports.getPubById = async (req, res) => {
  try {
    const pub = await Pub.findById(req.params.pubId);
    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }
    const transformedPub = {
      id: pub._id.toString(),
      ...pub.toObject(),
   
    };

    res.status(200).json(transformedPub);
  } catch (error) {
    res.status(500).json({ message: "Error fetching publication", error: error.message });
  }
};

/*exports.updatePub = async (req, res) => {
  try {
    const partenaire = req.user._id; // Utilisez l'ID utilisateur injecté par le middleware isAuth
    const updateData = req.body;

    if (req.file) {
      updateData.pubImage = req.file.path.replace(/\\/g, "/").replace("images", "").replace("src/", "");
    }

    const pub = await Pub.findById(req.params.pubId);

    if (!pub) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const partenairee = await Partenaire.findById(partenaire);
    if (!partenairee) {
      return res.status(404).json({ message: "Partenaire not found" });
    }

    if (!partenairee.publications.includes(pub._id)) {
      return res.status(403).json({ message: "You do not have permission to update this publication" });
    }

    await Pub.findByIdAndUpdate(req.params.pubId, updateData, { new: true, runValidators: true });

    res.status(200).json({ message: "Publication updated successfully", pub });
  } catch (error) {
    res.status(500).json({ message: "Error updating publication", error: error.message });
  }
};
*/
//update pub
const upload = multer({
  dest: 'images/', // Directory to store the uploaded files
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
});



exports.updatePub = async (req, res) => {
  upload.single('pubImage') // Use multer middleware to handle file uploads

     const {  title, description, adress, rating, nb_likes, category, state, duree, pourcentage } = req.body;
     const pubId = req.params.pubId; // The ID of the publication to update
     const partenaireId = req.user._id;
     const pubImage = req.file ? req.file.path : null

     

     try {
      const pub = await Pub.findById(pubId);
  
      if (!pub) {
        return res.status(404).json({ status: 'error', message: 'Publication not found' });
      }
  
      console.log('partenaireId:', partenaireId);
      console.log('pub.partenaireId:', pub.partenaireId);
  
      if (!pub.partenaireId) {
        return res.status(400).json({ status: 'error', message: 'Publication missing partenaireId' });
      }
  
      if (pub.partenaireId.toString() !== partenaireId.toString()) {
        return res.status(403).json({ status: 'error', message: 'Unauthorized: You can only update your own publications' });
      }

      // Update fields if provided
      pub.pubImage = pubImage || pub.pubImage;
      pub.title = title || pub.title;
      pub.description = description || pub.description;
      pub.adress = adress || pub.adress;
      pub.rating = rating || pub.rating;
      pub.nb_likes = nb_likes || pub.nb_likes;
      pub.category = category || pub.category;
      pub.state = state || pub.state;
      pub.duree = duree || pub.duree;
       pub.pourcentage = pourcentage || pub.pourcentage;
     
      // if (state === "promo") {
      //  pub.duree = duree || pub.duree;
      //  pub.pourcentage = pourcentage || pub.pourcentage;
      // }
    
      const updatedPub = await pub.save();
      res.json({ status: 'success', data: updatedPub });
    } catch (error) {
      console.error('Error updating publication:', error);
      res.status(500).json({ status: 'error', message: 'Error updating publication: ' + error.message });
    }
  };

//delete pub   

exports.deletePub = async (req, res) => {
  const partenaireId = req.user._id;
  const pubId = req.params.pubId;

  if (!partenaireId || !pubId) {
    return res.status(400).json({ message: 'Missing partenaire ID or pub ID' });
  }

  try {
    const partenaire = await Partenaire.findById(partenaireId);
    const pub = await Pub.findById(pubId);

    if (!partenaire || !pub) {
      return res.status(404).json({ message: 'Partenaire or Pub not found' });
    }

    // Check publication ownership (optional, if needed)
    if (!partenaire.publications.includes(pub._id)) {
      return res.status(403).json({ message: 'Unauthorized: You cannot delete this publication' });
    }

    // Remove from partenaire's publications
    partenaire.publications.pull(pub._id);
    await partenaire.save();

    // Delete the publication document from the database
    await Pub.findByIdAndDelete(pubId);

    res.status(200).json({ message: 'Pub deleted successfully' });
  } catch (error) {
    console.error('Error deleting pub:', error);
    res.status(500).json({ message: 'Error deleting pub' });
  }
};

/*exports.deletePub = async (req, res) => {
  const partenaireId = req.user._id;
    const pubId = req.params.pubId;
  
    if (!partenaireId || !pubId) {
      return res.json({ status: 'error', message: 'Missing partenaire ID or pub ID' });
    }
    try {
      const partenaire = await Partenaire.findById(partenaireId);
     
      if (!partenaire) {
        return res.json({ status: 'error', message: 'Partenaire not found' });
      }
      
  
      const pubIndex = partenaire.publications.indexOf(pubId);
      if (pubIndex === -1) {
        return res.json({ status: 'error', message: 'Pub not found in publications' });
      }
  
      partenaire.publications.splice(pubIndex, 1);
      await partenaire.save();
  
      return res.json({ status: 'success', message: 'Pub removed from publications' });
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  };*/

