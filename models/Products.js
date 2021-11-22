const mongooes = require('mongoose');
const Schema = mongooes.Schema;
const slug = require('mongoose-slug-generator');
mongooes.plugin(slug);
const Products = new Schema({
    name: {
        type: String,
        required: true,
    },
    idBrand: {
        type: Schema.Types.ObjectId,
        ref: 'Brands',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageRepresent: {
        type:String
    },
    slug:{
        type:String,
        slug:'name',
        unique:true
    }
}, {
    timestamps: true,
})

module.exports = mongooes.model('Products', Products);