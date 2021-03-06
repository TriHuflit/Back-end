const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const DetailWages= new Schema({
    idCus:{
        type:Schema.Types.ObjectId,
        ref:'Customers',
        require:true,
    },
    idWages:{
        type:Schema.Types.ObjectId,
        ref:'Wages',
        require:true,
    },
    minus:{
        type:Float32Array,
    },
    bonus:{
        type:Float32Array,
    },
    content:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});

module.exports=mongoose.type("DetailWages",DetailWages);
