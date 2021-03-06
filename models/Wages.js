const mongoose = require('mongoose');
const Schema = mongooes.Schema;

const Wages = new Schema({
    name: {
        type: String,
        required: true
    },
    moneyWages: {
        type: Float32Array,
        require: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Wages", Wages);
