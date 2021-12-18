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
    phoneReviecve: {
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
        "Đã giao",
      ],
      default: "Chờ xác nhận",
    },
    payments: {
      type: String,
      enum: ["Đã thanh toán", "Thanh toán tiền mặt"],
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
