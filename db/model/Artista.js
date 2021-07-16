const { Schema, model } = require("mongoose");

const ArtistaSchema = new Schema({
  nombre: { type: String, unique: true, required: true },
  tipo: {
    type: String,
    validate: [
      (tipo) => tipo === "Grupo" || tipo === "Solo",
      "Deben introducir un tipo correcto",
    ],
  },
  urlImagen: String,
  integrantes: { type: [String], required: false },
});

const Artista = model("Artista", ArtistaSchema, "artista");

module.exports = Artista;
