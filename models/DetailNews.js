const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const DetailNews = new Schema({
    idNews:{
        type:Schema.Types.ObjectId,
        ref:'News',
        require:true,
    },
    content:{
        type:String,
        require:true,
    },
    image:{
        data:Buffer,
        contentType:String,
        require:true,
    },
   
}, {
    timestamps:true,
})
module.exports = mongoose.type("DetailNews",DetailNews);