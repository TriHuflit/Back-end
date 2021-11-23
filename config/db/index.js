const mongoose = require('mongoose');
require("dotenv").config({path:'../../.env'});
async function connect() {
    try {

        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@shoppet.151fx.mongodb.net/shoppet?retryWrites=true&w=majority`);
        console.log('Connect DB successfully !!!');
    }
    catch (error) {
        console.log(`Conenct DB failed: ${error} `);
        process.exit(1);
    }
}
module.exports = { connect }