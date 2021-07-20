const Cancion = require("../model/Cancion");

const listarCanciones = async () => {
  const lista = await Cancion.find();

  return lista;
};

const getCancion = async (idCancion) => {
  const cancion = await Cancion.findById(idCancion);

  return cancion;
};

module.exports = { listarCanciones, getCancion };
