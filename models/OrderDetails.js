const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderDetails = new Schema(
  {
    idOrder: {
      type: Schema.Types.ObjectId,
      ref: "Orders",
      require: true,
    },
    idProducts: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
    idWarehouses: [
      {
        type: Schema.Types.ObjectId,
        ref: "WareHouses",
      },
    ],
    Price: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      enum: [
        "Đã đánh giá",
        "Chưa đánh giá"
      ],
      default: "Chưa đánh giá",
      type: String
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("OrderDetails", OrderDetails);
