const mongooes = require('mongoose');
const Schema = mongooes.Schema;

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
        data: Buffer,
        contentType: String,
    },

}, {
    timestamps: true,
})

module.exports = mongooes.model('Products', Products);