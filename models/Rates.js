const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rates = new Schema(
  {
    idCus: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      require: true,
    },
    idProduct: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      require: true,
    },
    content: {
      type: String,
    },
    star: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rates", Rates);
