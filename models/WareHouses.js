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
       
    },
    color: {
        type: String,
        minlength: 7,
    },
    amoutStock: {
        type: Number,
        required: true,
        default: 1,
    },
    real_price:{
        type:Number,
        require:true,
    }
    ,
    amoutImport: {
        type: Number,
        required: true,
        default: 1,
    }
}, {
    timestamps: true,
})
module.exports = mongoose.model("WareHouses", WareHouses);