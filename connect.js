const mongoose = require("mongoose");


// function for database connection
async function connectToMongoDB(url){
    return mongoose.connect(url);
}

module.exports = { connectToMongoDB };