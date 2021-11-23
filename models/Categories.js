const mongooes = require('mongoose');
const Schema= mongooes.Schema;
const slug = require('mongoose-slug-generator');
mongooes.plugin(slug);
const Categories = new Schema({
    name:{
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

module.exports=mongooes.model("Categories",Categories);