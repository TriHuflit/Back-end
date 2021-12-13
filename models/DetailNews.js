const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetailNews = new Schema(
  {
    idNews: {
      type: Schema.Types.ObjectId,
      ref: "News",
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    image: {
      url: {
        type: String,
      },
      cloud_id: {
        type: String,
      },
    },
    author: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("DetailNews", DetailNews);
