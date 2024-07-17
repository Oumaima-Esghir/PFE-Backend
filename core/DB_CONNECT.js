require('dotenv').config();
const mongoose = require('mongoose');

exports.connect = () => {
    try{
        mongoose.connect(process.env.DB_URI);
        console.log('db connected');
    }catch (error) {
        console.log(error);
    }
}