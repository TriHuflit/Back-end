const mongooes = require('mongoose');
const Schema= mongooes.Schema;

const SubCategories = new Schema({
    idCate:{
        type:Schema.Types.ObjectId,
        ref:'Categories',
        require:true,
    },
    name:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

module.exports=mongooes.model("SubCategories",SubCategories);