const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const Vouchers = new Schema({
    title: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        require: true
    },
    condition: {
        type: Number,
    },
    desciption: {
        type: String,
    },
    dateStart: {
        type: Date,
        require: true,
    },
    dateEnd: {
        type: Date,
        require: true,
    },
    typeVoucher: {
        type: String,
        enum: [
            "Voucher Ship",
            "Voucher Store"
        ],
        require: true,
    }
}, {
    timestamps: true,
});

module.exports = mongooes.model("Vouchers", Vouchers);
