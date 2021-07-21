const { crearError } = require("../../utilities/errores");
const Cancion = require("../model/Cancion");

const listarCanciones = async () => {
  const lista = await Cancion.find();

  return lista;
};

const listarCancionesCoincidencias = async (nombreABuscar) => {
  const lista = await Cancion.find({
    nombre: { $regex: nombreABuscar, $options: "i" },
  });

  return lista;
};

const getCancion = async (idCancion) => {
  const cancion = await Cancion.findById(idCancion);

  if (!cancion.nombre) {
    throw crearError("No se ha encontrado ninguna canción", 404);
  }

  return cancion;
};

module.exports = { listarCanciones, getCancion, listarCancionesCoincidencias };
