const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const RepRates= new Schema({
    idStaff:{
        type:Schema.Types.ObjectId,
        ref:"Customers",
        require:true,
    },
    idRate:{
        type:Schema.Types.ObjectId,
        ref:"Rates",
        require:true,
    },
    content:{
        type:String,
        required:true,
    },
    image:{
       data:Buffer,
       contentType:String
    },
},{
    timestamps:true,
});

module.exports=mongoose.type("RepRates",RepRates);
