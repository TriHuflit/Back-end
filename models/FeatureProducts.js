const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeatureProducts = new Schema({
    idProducts: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        require: true,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },

}, {
    timestamps: true,
})
module.exports = mongoose.model("FeatureProducts", FeatureProducts);