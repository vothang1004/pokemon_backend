const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "servers" }
);

module.exports = mongoose.model("Server", serverSchema);
