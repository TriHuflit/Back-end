const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RepRates = new Schema(
  {
    idStaff: {
      type: Schema.Types.ObjectId,
      ref: "Customers",
      require: true,
    },
    idRate: {
      type: Schema.Types.ObjectId,
      ref: "Rates",
      require: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RepRates", RepRates);
