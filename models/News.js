const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.slug = slug;
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
    image: {
      url: {
        type: String,
      },
      cloud_id: {
        type: String,
      },
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("News", News);
