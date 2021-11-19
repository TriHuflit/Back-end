const mongooes = require('mongoose');
const Schema= mongooes.Schema;

const Brands = new Schema({
   
    idSub:{
        type:Schema.Types.ObjectId,
        ref:'SubCategies',
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    origin:{
        type:String,
        required:true,
    },
   
},{
    timestamps:true,
})

module.exports=mongooes.model('Brands',Brands);