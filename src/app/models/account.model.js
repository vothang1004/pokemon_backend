const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    server: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
      default: null,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [String],
    link: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, collection: "accounts" }
);

module.exports = mongoose.model("Account", accountSchema);
