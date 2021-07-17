const { Schema, model } = require("mongoose");
require("./Artista");
require("./Genero");

const CancionSchema = new Schema({
  url: { type: String, unique: true, required: true },
  nombre: String,
  artista: {
    type: Schema.Types.ObjectId,
    ref: "Artista",
  },
  genero: {
    type: Schema.Types.ObjectId,
    ref: "Genero",
  },
});

const Cancion = model("Cancion", CancionSchema, "cancion");

module.exports = Cancion;
