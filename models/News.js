const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const News = new Schema(
  {
    idCus: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("News", News);
