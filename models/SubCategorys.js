const mongooes = require('mongoose');
const Schema= mongooes.Schema;

const SubCategories = new Schema({
    idCate:{
        type:Schema.Types.ObjectId,
        require:true,
    },
    name:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

module.exports=mongooes.type("SubCategories",SubCategories);