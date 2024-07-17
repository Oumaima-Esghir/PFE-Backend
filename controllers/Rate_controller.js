const rateSchema = require('../models/Rate_model');
const User = require('../models/User_model');

// GET rates
exports.getRates = async (req, res) => {
    try {

        const Rates = await rateSchema.find({});
        res.json({status:'success', data: Rates});

    }catch(error) {
        res.json({status:'error', message: error})
    }
};
/*
// GET rate BY ID
exports.getRate = async (req, res) => {
    const { id } = req.params;

    // verfiy id 
    if (!id || id == null ) {
        res.json({status:'error', message: 'no id provided'});
    }

    try {
        const Rate = await rateSchema.findById(id);

        if (!Rate) {
            res.json({status:'error', message: 'no Rate with that id  has been found'});
        }

        res.json({status:'success', data: Rate});
        
    }catch(error) {
        res.json({status:'error', message: error})
    }
};*/

// CREATE rate
exports.postRate = async (req, res) => {
    const { idUser, idPub, rate } = req.body;

    if(!idUser || !idPub || !rate) {
        res.json({status:'error', message: 'please provide all data'});
    }

    try {
        
        const newRateObj = {
            idUser : idUser,
            idPub : idPub,
            rate
        };

        const newRate = new rateSchema(newRateObj);

        const result = await newRate.save();

        res.json({status:'success', data: result});
        
    }catch(error) {
        res.json({status:'error', message: error})
    }
};