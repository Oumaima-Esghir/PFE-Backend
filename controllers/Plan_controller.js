const PlanSchema = require('../models/Plan_model')
const moment = require('moment');

// GET PLANS
exports.getPlans = async (req, res) => {
    try {

        const plans = await PlanSchema.find({});
        res.json({status:'success', data: plans});

    }catch(error) {
        res.json({status:'error', message: error})
    }
};

// GET PLAN BY ID
exports.getPlan = async (req, res) => {
    const { id } = req.params;

    // verfiy id 
    if (!id || id == null ) {
        res.json({status:'error', message: 'no id provided'});
    }

    try {
        const plan = await PlanSchema.findById(id);

        if (!plan) {
            res.json({status:'error', message: 'no plan with that id  has been found'});
        }

        res.json({status:'success', data: plan});
        
    }catch(error) {
        res.json({status:'error', message: error})
    }
};

// CREATE PLAN
exports.postPlan = async (req, res) => {
    const { idUser, idPub, title, dateFrom, dateTo, timeFrom, timeTo, nb_persons, reminder } = req.body;
  
    try {
      
      const DateFrom = moment(`${dateFrom}`, 'YYYY-MM-DD').toDate();
      const formattedDateFrom = DateFrom.toISOString().slice(0, 10);
      
      const DateTo = moment(`${dateTo}`, 'YYYY-MM-DD').toDate();
      const formattedDateTo = DateTo.toISOString().slice(0, 10);

      const TimeFromMoment = moment.utc(`${timeFrom}`, 'HH:mm');
      const formattedTimeFrom = TimeFromMoment.format('HH:mm');  // Store the formatted string
      
      const TimeToMoment = moment.utc(`${timeTo}`, 'HH:mm');
      const formattedTimeTo = TimeToMoment.format('HH:mm');
      
  
      // Validate required fields
      if (!idUser || !idPub || !title || !dateFrom || !dateTo || !timeFrom || !timeTo || !nb_persons || !reminder) {
        return res.status(400).json({ status: 'error', message: 'Please provide all required data' });
      }
  
      // Create new plan object
      const newPlan = new PlanSchema({
        idUser,
        idPub,
        title,
        dateFrom: formattedDateFrom,
        dateTo: formattedDateTo,
        timeFrom: formattedTimeFrom,
        timeTo: formattedTimeTo,
        nb_persons,
        reminder
      });
  
      // Save the plan to the database
      const result = await newPlan.save();
  
      return res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  };

// DELETE PLAN
exports.deletePlan = async (req, res) => {
    const { id } = req.params;

    // verfiy id 
    if (!id) {
        res.json({status:'error', message: 'no id provided'});
    }

    const planFound = await PlanSchema.findById(id);
    if(!planFound) { res.json({status:'error', message: 'no plan found by that id'}) }

    try {
        
        const result = await PlanSchema.findByIdAndDelete(id);
        res.json({status:'success', message: 'plan deleted with success'});

    }catch(error) {
        res.json({status:'error', message: error})
    }
};

// UPDATE PLAN

    exports.updatePlan = async (req, res) => {
        const { id } = req.params;
        const  { idUser, idPub, title, dateFrom, dateTo, timeFrom, timeTo, nb_persons, reminder }  = req.body;

        const DateFrom = moment(`${dateFrom}`, 'YYYY-MM-DD').toDate();
      const formattedDateFrom = DateFrom.toISOString().slice(0, 10);
      
      const DateTo = moment(`${dateTo}`, 'YYYY-MM-DD').toDate();
      const formattedDateTo = DateTo.toISOString().slice(0, 10);

      const TimeFromMoment = moment.utc(`${timeFrom}`, 'HH:mm');
      const formattedTimeFrom = TimeFromMoment.format('HH:mm');  // Store the formatted string
      
      const TimeToMoment = moment.utc(`${timeTo}`, 'HH:mm');
      const formattedTimeTo = TimeToMoment.format('HH:mm');
    
        if (!idUser || !idPub || !title || !dateFrom || !dateTo || !timeFrom || !timeTo || !nb_persons || !reminder) {
          return res.status(400).json({ status: 'error', message: 'Please provide all required data' });
        }
    
        try {
    
            const updateplanObj = {
              idUser,
              idPub,
              title,
              dateFrom: formattedDateFrom,
              dateTo: formattedDateTo,
              timeFrom: formattedTimeFrom,
              timeTo: formattedTimeTo,
              nb_persons,
              reminder
            };
    
            const result = await PlanSchema.findByIdAndUpdate(id, updateplanObj, {new: true});
    
            if(!result) {
                res.json({status:'error', message: 'Plan not found'});
            }
    
            res.json({status:'success', data: result});
    
        }catch(error) {
            res.json({status:'error', message: error})
        }
    };

//SHARE PLAN
exports.sharePlan = async (req, res) => {
  const { id } = req.params;

  // Verify id
  if (!id || id === null) {
    return res.json({ status: 'error', message: 'No id provided' });
  }

  try {
    const plan = await PlanSchema.findById(id);

    if (!plan) {
      return res.json({ status: 'error', message: 'No plan with that id found' });
    }

    // **Generate a unique link for the plan**
    const uniqueLink = `http://localhost:3000/plans/${id}`; // Replace with your domain

    res.json({ status: 'success', message: 'Plan shared successfully!', link: uniqueLink });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};

// SEARCH
exports.searchPlans = async (req, res) => {
    const { query } = req.query;
    console.log(query)
  
    if (!query) {
      return res.json({ status: "error", message: "Please provide a search query" });
    }
  
    try {
      // Parse the query string into a number
      const numPagesQuery = parseInt(query);
      
      // Check if the parsing was successful and it's a valid number
      const searchQuery = {
        $or: [
          { author: { $regex: query, $options: "i" } },
          { titre: { $regex: query, $options: "i" } },
          { numPages: isNaN(numPagesQuery) ? -1 : numPagesQuery } // Handle NaN case
        ],
      };
  
      const pubs = await PubSchema.find(searchQuery);
  
      if (pubs.length === 0) {
        return res.json({ status: "error", message: "No pubs found" });
      }
  
      return res.json({ status: "success", data: pubs });
  
    } catch (error) {
      console.error("Error in searchPlans:", error); // Log the error for debugging
      return res.json({ status: "error", message: "An error occurred during search" });
    }
};