const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, require: true },
  password: { type: String, require: true },
});

module.exports = mongoose.model("users", userSchema);
