const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WareHouses = new Schema({
    idProducts: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        require: true,
    },
    idCustomer: {
        type: Schema.Types.ObjectId,
        ref: 'Customers',
        required: true,
    },
    color: {
        type: String,
        minlength: 7,
    },
    amoutStock: {
        type: Number,
        required: true,
        default: 0,
    },
    amoutImport: {
        type: Number,
        required: true,
        default: 0,
    }
}, {
    timestamps: true,
})
module.exports = mongoose.model("WareHouses", WareHouses);