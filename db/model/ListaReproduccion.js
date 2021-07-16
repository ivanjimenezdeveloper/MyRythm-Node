const { Schema, model } = require("mongoose");

const ListaReproduccionSchema = new Schema({
  canciones: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cancion",
      required: false,
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tipo: String,
});

const ListaReproduccion = model(
  "ListaReproduccion",
  ListaReproduccionSchema,
  "lista-reproduccion"
);

module.exports = ListaReproduccion;
