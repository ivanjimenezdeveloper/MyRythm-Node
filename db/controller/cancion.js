const { crearError } = require("../../utilities/errores");
const Cancion = require("../model/Cancion");

const listarCanciones = async () => {
  const lista = await Cancion.find();

  return lista;
};

const getCancion = async (idCancion) => {
  const cancion = await Cancion.findById(idCancion);

  if (!cancion.nombre) {
    throw crearError("No se ha encontrado ninguna canción", 404);
  }

  return cancion;
};

module.exports = { listarCanciones, getCancion };
