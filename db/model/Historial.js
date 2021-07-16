const { Schema, model } = require("mongoose");

const HistorialSchema = new Schema({
  canciones: [
    {
      idCancion: {
        type: Schema.Types.ObjectId,
        ref: "Cancion",
        required: true,
      },
      fecha: { type: Schema.Types.Date, required: true },
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Historial = model("Historial", HistorialSchema, "historial");

module.exports = Historial;
