const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DescribeProducts = new Schema({
    idProducts: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        require: true,
    },
    title: {
        type: String,
    },
    image:[
        {
            url:{
                type:String
            },
            cloud_id:{
                type:String
            },
        }
    ],
    content: {
        type: String,
    },

}, {
    timestamps: true,
})
module.exports = mongoose.model("DescribeProducts", DescribeProducts);