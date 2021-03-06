const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const Rates= new Schema({
    idCus:{
        type:Schema.Types.ObjectId,
        ref:"Customers",
        require:true,
    },
    content:{
        type:String,
      
    },
    image:{
       data:Buffer,
       contentType:String
    },
    start:{
        type:Number,
        require:true,
    },
},{
    timestamps:true,
});

module.exports=mongoose.type("Rates",Rates);
