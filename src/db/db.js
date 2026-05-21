const mongoose = require('mongoose');

async function connectDB(){
    try {
        console.log(process.env.MONGODB_URI);
       await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = connectDB;
