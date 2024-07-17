const { duration } = require('moment');
const PubSchema = require('../models/Pub_model');
const Partenaire = require('../models/Partenaire_model');



// GET PUBS
exports.getPubs = async (req, res) => {
    try {

        const pubs = await PubSchema.find({});
        res.json({status:'success', data: pubs});

    }catch(error) {
        res.json({status:'error', message: error})
    }
};

// GET PUBS BY ID
exports.getPub = async (req, res) => {
    const { id } = req.params;

    // verfiy id 
    if (!id || id == null ) {
        res.json({status:'error', message: 'no id provided'});
    }

    try {
        const pub = await PubSchema.findById(id);

        if (!pub) {
            res.json({status:'error', message: 'no pub with that id  has been found'});
        }

        res.json({status:'success', data: pub});
        
    }catch(error) {
        res.json({status:'error', message: error})
    }
};

// CREATE PUBS
exports.postPub = async (req, res) => {
    const partenaireId = req.partenaire._id;
    const { pubImage, title, description, adress, rating, nb_likes, category, state, duree, pourcentage} = req.body;
 
    try {
        const partenaire = await Partenaire.findById(partenaireId);
        if (!partenaire) {
          return res.json({ status: 'error', message: 'partenaire not found' });
        }
 if(state === "promo") {
    if(!pubImage || !title || !description || !adress || !rating || !nb_likes || !category || !state || !duree || !pourcentage) {
        res.json({status:'error', message: 'please provide all data'});
    }
    const newpubObj = {
        pubImage,
        title,
        description,
        adress,
        rating,
        nb_likes,
        category,
        state,
        duree,
        pourcentage
              };
              const newpub = new PubSchema(newpubObj);
              const result = await newpub.save();

              res.json({status:'success', data: result});
 }
 else {
    if(!pubImage || !title || !description || !adress || !rating || !nb_likes || !category || !state ) {
        res.json({status:'error', message: 'please provide all data'});
    }
        const newpubObj = {
  pubImage,
  title,
  description,
  adress,
  rating,
  nb_likes,
  category,
  state
  } 
  const newpub = new PubSchema(newpubObj);
  const result = await newpub.save();

  res.json({status:'success', data: result});
};        
    }
    catch(error) {
        res.json({status:'error', message: error})
    }

};

// DELETE PUBS
exports.deletePub = async (req, res) => {
    const { id } = req.params;

    // verfiy id 
    if (!id) {
        res.json({status:'error', message: 'no id provided'});
    }

    const pubFound = await PubSchema.findById(id);
    if(!pubFound) { res.json({status:'error', message: 'no pub found by that id'}) }

    try {
        
        const result = await PubSchema.findByIdAndDelete(id);
        res.json({status:'success', message: 'pub deleted with success'});

    }catch(error) {
        res.json({status:'error', message: error})
    }
};
//create rate
//getrates

// UPDATE PUBS

exports.updatePub = async (req, res) => {
    const { id } = req.params;
    const { pubImage, title, description, adress, rating, nb_likes, category, state, duree, pourcentage } = req.body;

    try {
        if (state === "promo") {
            if (!pubImage || !title || !description || !adress || !rating || !nb_likes || !category || !state || !duree || !pourcentage) {
                return res.json({ status: 'error', message: 'Please provide all data' });
            }

            const updatepubObj = {
                pubImage,
                title,
                description,
                adress,
                rating,
                nb_likes,
                category,
                state,
                duree,
                pourcentage
            };

            const result = await PubSchema.findByIdAndUpdate(id, updatepubObj, { new: true });

            if (!result) {
                return res.json({ status: 'error', message: 'Pub not found' });
            }

            return res.json({ status: 'success', data: result });
        } else {
            if (!pubImage || !title || !description || !adress || !rating || !nb_likes || !category || !state) {
                return res.json({ status: 'error', message: 'Please provide all data' });
            }

            const updatepubObj = {
                pubImage,
                title,
                description,
                adress,
                rating,
                nb_likes,
                category,
                state
            };

            const result = await PubSchema.findByIdAndUpdate(id, updatepubObj, { new: true });

            if (!result) {
                return res.json({ status: 'error', message: 'Pub not found' });
            }

            return res.json({ status: 'success', data: result });
        }
    } 
    catch (error) {
        return res.json({ status: 'error', message: error.message });
    }
};


// SEARCH
exports.searchPubs = async (req, res) => {
    const { query } = req.query;
    console.log(query)
  
    if (!query) {
      return res.json({ status: "error", message: "Please provide a search query" });
    }
  
    try {
      // Parse the query string into a number
      const ratingQuery = parseInt(query);
      const nb_likesQuery = parseInt(query);
      
      // Check if the parsing was successful and it's a valid number
      const searchQuery = {
        $or: [
          { pubImage: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { adress: { $regex: query, $options: "i" } },
          // Handle NaN case
          { rating: isNaN(ratingQuery) ? -1 : ratingQuery },
          { nb_likes: isNaN(nb_likesQuery) ? -1 : nb_likesQuery },
          { category: { $regex: query, $options: "i" } },
          { state: { $regex: query, $options: "i" } },    
        ],
      };
  
      const pubs = await PubSchema.find(searchQuery);
  
      if (pubs.length === 0) {
        return res.json({ status: "error", message: "No pubs found" });
      }
  
      return res.json({ status: "success", data: pubs });
  
    } catch (error) {
      console.error("Error in searchPubs:", error); // Log the error for debugging
      return res.json({ status: "error", message: "An error occurred during search" });
    }
};