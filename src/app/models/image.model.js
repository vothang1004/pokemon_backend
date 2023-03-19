const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  },
  { timestamps: true, collection: "images" }
);

module.exports = mongoose.model("Image", imageSchema);
