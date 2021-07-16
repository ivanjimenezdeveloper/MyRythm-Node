const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  email: { type: String, required: true },
  urlFoto: String,
  generosPreferidos: {
    type: [Schema.Types.ObjectId],
    ref: "Genero",
    required: false,
  },
  localizacion: {
    type: Schema.Types.ObjectId,
    ref: "Localizacion",
    required: true,
  },
});

const User = model("User", UserSchema, "user");

module.exports = User;
