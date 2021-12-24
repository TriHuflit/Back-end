const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Orders = new Schema(
  {
    idCus: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      require: true,
    },
    idStaff: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
    },
    idVoucher: {
      type: Schema.Types.ObjectId,
      ref: "Vouchers",
    },
    nameRecieve: {
      type: String,
      required: true,
    },
    phoneRecieve: {
      type: String,
      required: true,
    },
    addressRecieve: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Đã xác nhận",
        "Hủy đơn",
        "Đang giao hàng",
        "Đã nhận hàng",
      ],
      default: "Chờ xác nhận",
    },
    payments: {
      type: Boolean,
      default: false,
      required: true,
    },
    note: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Orders", Orders);
