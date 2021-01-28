const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema({
  timestamp: {
    type: String,
    default: "",
  },
});

const expireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  product: {
    type: String,
    default: "",
  },
  // expiry: {
  //   type: String,
  //   default: "",
  // },
  expiry: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notifications: [notifySchema],
  //timestamp: new Date(),
  timestamp: Number,
});

mongoose.model("Expire", expireSchema);
