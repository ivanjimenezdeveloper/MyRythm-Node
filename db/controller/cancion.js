const Cancion = require("../model/Cancion");

const listarCanciones = async () => {
  const lista = await Cancion.find();

  return lista;
};

module.exports = { listarCanciones };
