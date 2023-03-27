const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    ma_tk: {
      type: String,
      required: true,
    },
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
    link_facebook: {
      type: String,
      default: null,
    },
    link_zalo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, collection: "accounts" }
);

accountSchema.index({ ma_tk: "text", title: "text" });

module.exports = mongoose.model("Account", accountSchema);
