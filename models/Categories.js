const mongooes = require('mongoose');
const Schema= mongooes.Schema;

const Categories = new Schema({
    name:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

module.exports=mongooes.model("Categories",Categories);