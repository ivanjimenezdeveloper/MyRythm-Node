const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  tipo: String,
});

const User = model("User", UserSchema, "user");

module.exports = User;
