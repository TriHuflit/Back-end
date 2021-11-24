const mongooes = require('mongoose');
const Schema= mongooes.Schema;
var slug = require('mongoose-slug-updater');

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
        unique:true,
    }
},{
    timestamps:true,
})

module.exports=mongooes.model('Brands',Brands);