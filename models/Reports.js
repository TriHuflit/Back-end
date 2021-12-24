const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Reports = new Schema({
    statistical: {
        type: Date
    }
})

module.exports = mongoose.model('Reports', Reports);