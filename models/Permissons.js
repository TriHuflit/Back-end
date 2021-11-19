const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const Permissons= new Schema({
    name:{
        type:String,
        require:true
    }
},{
    timestamps:true,
})

module.exports=mongoose.model("Permissions",Permissons);