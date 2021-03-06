const mongoose = require('mongoose');
const Schema=mongooes.Schema;

const Vouchers= new Schema({
    name:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        require:true
    },
    DateStart:{
        type:Date,
        require:true,
    },
    DateEnd:{
        type:Date,
        require:true,
    },
},{
    timestamps:true,
});

module.exports=mongoose.type("Vouchers",Vouchers);
