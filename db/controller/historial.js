const Cancion = require("../model/Cancion");
const User = require("../model/User");
const Genero = require("../model/Genero");
const Historial = require("../model/Historial");
const { getCancion } = require("./cancion");
const { crearError } = require("../../utilities/errores");
const { generarGenerosFavoritos } = require("./user");

const listarHistorialPorUsuario = async (idUser) => {
  try {
    const lista = await Historial.findOne({
      user: idUser,
    }).populate("canciones.idCancion");
    const listaFormateada = await Cancion.populate(lista, {
      path: "canciones.idCancion.genero",
      model: Genero,
    });

    return listaFormateada;
  } catch (err) {
    throw crearError("Error con la ID de usuario", 403);
  }
};

const crearHistorialUsuario = async (idUser, sesion) => {
  try {
    const historial = await Historial.create({
      canciones: [],
      user: idUser,
    });
  } catch (err) {
    throw crearError(
      "No se ha podido crear el historial para el usuario indicado",
      500
    );
  }
  return true;
};

const reproduccionCancion = async (idCancion, idUsuario) => {
  try {
    const existeCancion = await getCancion(idCancion);

    const fechaActual = Date.now();

    await Historial.findOneAndUpdate(
      { user: idUsuario },
      { $addToSet: { canciones: { idCancion, fecha: fechaActual } } },
      async (err, result) => {
        if (err) {
          const error = crearError(
            "No se ha podido añadir la cancion al historial",
            500
          );
          throw error;
        }
      }
    );

    await generarGenerosFavoritos(
      await listarHistorialPorUsuario(idUsuario),
      idUsuario
    );

    if (!existeCancion) {
      throw crearError("No existe la cancion especificada", 403);
    }
  } catch (err) {
    throw crearError("No se ha podido añadir la cancion al historial", 500);
  }
};

module.exports = {
  listarHistorialPorUsuario,
  crearHistorialUsuario,
  reproduccionCancion,
};
