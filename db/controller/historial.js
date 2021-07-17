const Cancion = require("../model/Cancion");
const Genero = require("../model/Genero");
const Historial = require("../model/Historial");

const listarHistorialPorUsuario = async (idUsuario) => {
  const lista = await Historial.find({
    user: idUsuario,
  }).populate("canciones.idCancion");

  const listaFormateada = await Cancion.populate(lista, {
    path: "canciones.idCancion.genero",
    model: Genero,
  });

  return listaFormateada;
};

module.exports = { listarHistorialPorUsuario };
