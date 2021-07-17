const ListaReproduccion = require("../model/ListaReproduccion");

const listarListasReproduccionPorUsuario = async (idUsuario) => {
  const lista = await ListaReproduccion.find({
    user: idUsuario,
  }).populate("canciones");

  return lista;
};

module.exports = { listarListasReproduccionPorUsuario };
