const mongooes = require('mongoose');
const Schema= mongooes.Schema;
const slug = require('mongoose-slug-generator');
mongooes.plugin(slug);
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
    slug:{
        type:String,
        slug:'name',
        unique:true
    }
},{
    timestamps:true,
})

module.exports=mongooes.model('Brands',Brands);