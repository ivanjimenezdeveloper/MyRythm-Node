const { Schema, model } = require("mongoose");
require("./Cancion");

const HistorialSchema = new Schema({
  canciones: [
    {
      idCancion: {
        type: Schema.Types.ObjectId,
        ref: "Cancion",
        required: true,
      },
      fecha: { type: Schema.Types.Date, required: true },
      _id: false,
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Historial = model("Historial", HistorialSchema, "historial");

module.exports = Historial;
