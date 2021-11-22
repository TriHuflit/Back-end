const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customers = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    idPermission: {
        type: Schema.Types.ObjectId,
        ref: 'Permissons',
        required: true,
    },
    emailComfirm:{
        type:Boolean,
        default:false,
    }
}, {
    timestamps: true,
})


module.exports = mongoose.model('Customers', Customers);