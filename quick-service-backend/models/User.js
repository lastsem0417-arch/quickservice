const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user" // user | admin
  }
});

module.exports = mongoose.model("User", userSchema);