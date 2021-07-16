const { Schema, model } = require("mongoose");

const LocalizacionSchema = new Schema({
  nombre: { type: String, unique: true, required: true },
});

const Localizacion = model("Localizacion", LocalizacionSchema, "localizacion");

module.exports = Localizacion;
