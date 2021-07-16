const { Schema, model } = require("mongoose");

const GeneroSchema = new Schema({
  nombre: { type: String, unique: true, required: true, maxLength: 30 },
});

const Genero = model("Genero", GeneroSchema, "genero");

module.exports = Genero;
