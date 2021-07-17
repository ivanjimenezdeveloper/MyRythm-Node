const { Schema, model } = require("mongoose");
require("./User");

const AmigosSchema = new Schema({
  amigos: [
    {
      idAmigo: { type: Schema.Types.ObjectId, ref: "User" },
      aceptado: Schema.Types.Boolean,
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Amigos = model("Amigos", AmigosSchema, "amigos");

module.exports = Amigos;
