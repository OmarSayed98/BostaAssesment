const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    email: { type: String, unique: true },
    password: String,
    name: String,
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
