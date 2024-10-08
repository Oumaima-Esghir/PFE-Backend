const Plan = require('../models/Plan_model')
const Pub = require('../models/Pub_model')
const User = require('../models/User_model')
const moment = require('moment');

// GET PLANS
exports.getPlans = async (req, res) => {
 try {

  const plans = await Plan.find({});
  res.json({status:'success', data: plans});

 }catch(error) {
  res.json({status:'error', message: error})
 }
};

// GET PLAN BY ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching planning123", error: error.message });
  }
};
/*exports.getPlan = async (req, res) => {
  const userId = req.user._id; 
  try {
    const userId = req.user._id;
    console.log(userId)
    const plans = await Plan.find({userId: userId});
    console.log({plans})
    res.status(200).json({plans});
  } catch (error) {
    res.status(500).json({msg:'erreur',error:error.msg})
  }
};*/

exports.getPlan = async (req, res) => {
  console.log("test");
  const userId = req.user._id; // Assuming req.user is set by your isAuth middleware

  try {
    // Filter the planifications by the userId
    const plans = await Plan.find({ userId: userId });
    if (plans.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No planifications found for this user' });
    }

    // Transform each plan
    const transformedPlans = plans.map(plan => ({
      id: plan._id.toString(), // Convert ObjectId to string
      ...plan.toObject(),     // Convert Mongoose document to plain object
    }));

    // Respond with transformed plans
    res.json({ status: 'success', data: transformedPlans });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// CREATE PLAN
exports.postPlan = async (req, res) => {
 const { title, dateFrom, dateTo, timeFrom, timeTo, nb_persons, reminder } = req.body;
 const userId = req.user._id;
 const pubId = req.params.pubId;

 try {
 // console.log('Request parameters:', req.params);
 const user = await User.findById(userId);


 if (!user) {
  return res.json({ status: 'error', message: 'User not found' });
 }
 
 
 
  const DateFrom = moment(`${dateFrom}`, 'YYYY-MM-DD').toDate();
  const formattedDateFrom = DateFrom.toISOString().slice(0, 10);
 
  const DateTo = moment(`${dateTo}`, 'YYYY-MM-DD').toDate();
  const formattedDateTo = DateTo.toISOString().slice(0, 10);

  const TimeFromMoment = moment.utc(`${timeFrom}`, 'HH:mm');
  const formattedTimeFrom = TimeFromMoment.format('HH:mm'); // Store the formatted string
 
  const TimeToMoment = moment.utc(`${timeTo}`, 'HH:mm');
  const formattedTimeTo = TimeToMoment.format('HH:mm');
 

  // Validate required fields
  if ( !title || !dateFrom || !dateTo || !timeFrom || !timeTo || !nb_persons || !reminder) {
  return res.status(400).json({ status: 'error', message: 'Please provide all required data' });
  }

  const newPlan = new Plan({
  userId,
  pubId,
  title,
  dateFrom: formattedDateFrom,
  dateTo: formattedDateTo,
  timeFrom: formattedTimeFrom,
  timeTo: formattedTimeTo,
  nb_persons,
  reminder
  });
 // console.log('Creating plan:', newPlan);

  // Save the plan to the database
  const result = await newPlan.save();
  user.planifications.push(newPlan); // Assuming newplan should be result
  await user.save();

  res.json({ status: 'success', data: result }); // Single response
 } catch (error) {
  if (!res.headersSent) {
  return res.status(500).json({ status: 'error', message: error.message });
  } else {
  console.error('Error sending response:', error.message);
  }
 }
 };

// DELETE PLAN
exports.deletePlan = async (req, res) => {
    const userId = req.user._id;
  const planId = req.params.planId;

  if (!userId || !planId) {
    return res.status(400).json({ message: 'Missing user ID or plan ID' });
  }

  try {
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user || !plan) {
      return res.status(404).json({ message: 'User or Plan not found' });
    }

    // Check planning ownership (optional, if needed)
    if (!user.planifications.includes(plan._id)) {
      return res.status(403).json({ message: 'Unauthorized: You cannot delete this planning' });
    }

    // Remove from user's planifications
    user.planifications.pull(plan._id);
    await user.save();

    // Delete the planification document from the database
    await Plan.findByIdAndDelete(planId);

    res.status(200).json({ message: 'Planning deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ message: 'Error deleting plan' });
  }
};

/* const userId = req.user._id; // Assuming req.user is set by your isAuth middleware
 const planId = req.params.id;

 try {
 // First, find the plan to check ownership
 const plan = await Plan.findById(planId);

 // Check if the plan exists
 if (!plan) {
  return res.status(404).json({ status: 'error', message: 'planning not found' });
 }

 // Check if the logged-in user is the owner of the planning
 if (plan.userId.toString() !== userId.toString()) {
  return res.status(403).json({ status: 'error', message: 'You do not have permission to delete this planning' });
 }

 // If the checks pass, delete the publication
 await Plan.findByIdAndDelete(planId);

res.json({ status: 'success', message: 'Planning deleted successfully' });
} catch (error) {
res.status(500).json({ status: 'error', message: error.message });
}
};*/

// UPDATE PLAN

 exports.updatePlan = async (req, res) => {
 
  const { title, dateFrom, dateTo, timeFrom, timeTo, nb_persons, reminder } = req.body;

  const planId = req.params.planId;
  const userId = req.user._id;
  

  try {
   // Find the publication by ID and ensure the requesting partenaire is the owner
   const plan = await Plan.findById(planId);
   if (!plan) {
    return res.status(404).json({ status: 'error', message: 'Planning not found' });
   }

   if (plan.userId.toString() !== userId.toString()) {
    return res.status(403).json({ status: 'error', message: 'Unauthorized: You can only update your own planifications' });
   }

  const DateFrom = moment(`${dateFrom}`, 'YYYY-MM-DD').toDate();
  const formattedDateFrom = DateFrom.toISOString().slice(0, 10);
 
  const DateTo = moment(`${dateTo}`, 'YYYY-MM-DD').toDate();
  const formattedDateTo = DateTo.toISOString().slice(0, 10);

  const TimeFromMoment = moment.utc(`${timeFrom}`, 'HH:mm');
  const formattedTimeFrom = TimeFromMoment.format('HH:mm'); // Store the formatted string
 
  const TimeToMoment = moment.utc(`${timeTo}`, 'HH:mm');
  const formattedTimeTo = TimeToMoment.format('HH:mm');

 
  // Update fields if provided
  plan.title = title || plan.title;
  plan.dateFrom = dateFrom || plan.dateFrom;
  plan.dateTo = dateTo || plan.dateTo;
  plan.timeFrom = timeFrom || plan.timeFrom;
  plan.timeTo = timeTo || plan.timeTo;
  plan.nb_persons = nb_persons || plan.nb_persons;
  plan.reminder = reminder || plan.reminder;
 
  const updatedPlan = await plan.save();
  res.json({ status: 'success', data: updatedPlan });
 } catch (error) {
  res.status(500).json({ status: 'error', message: 'Error updating planning: ' + error.message });
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
 const plan = await Plan.findById(id);

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

// // SEARCH
// exports.searchPlans = async (req, res) => {
//  const { query } = req.query;
//  console.log(query)

//  if (!query) {
//   return res.json({ status: "error", message: "Please provide a search query" });
//  }

//  try {
//   // Parse the query string into a number
//   const numPagesQuery = parseInt(query);
 
//   // Check if the parsing was successful and it's a valid number
//   const searchQuery = {
//   $or: [
//    { author: { $regex: query, $options: "i" } },
//    { titre: { $regex: query, $options: "i" } },
//    { numPages: isNaN(numPagesQuery) ? -1 : numPagesQuery } // Handle NaN case
//   ],
//   };

//   const pubs = await PubSchema.find(searchQuery);

//   if (pubs.length === 0) {
//   return res.json({ status: "error", message: "No pubs found" });
//   }

//   return res.json({ status: "success", data: pubs });

//  } catch (error) {
//   console.error("Error in searchPlans:", error); // Log the error for debugging
//   return res.json({ status: "error", message: "An error occurred during search" });
//  }
//}; 