const { Schema, model } = require("mongoose");
require("./User");

const MathesSchema = new Schema({
  matches: [
    {
      idMatch: { type: Schema.Types.ObjectId, ref: "User" },
      aceptado: Schema.Types.Boolean,
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Matches = model("Matches", MathesSchema, "matches");

module.exports = Matches;
