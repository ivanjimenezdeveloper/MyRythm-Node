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
    const error = new Error("Error con la ID de usuario");
    error.codigo = 404;
    throw error;
  }
};

const crearHistorialUsuario = async (idUser, sesion) => {
  try {
    const historial = Historial.create({
      canciones: [],
      user: idUser,
    });
  } catch (err) {
    const error = new Error(
      "No se ha podido crear el historial para el usuario indicado"
    );
    error.codigo = 500;
    throw error;
  }
  return true;
};

const reproduccionCancion = async (idCancion, idUsuario) => {
  try {
    const existeCancion = await getCancion(idCancion);

    const fechaActual = Date.now();

    await Historial.findOneAndUpdate(
      { user: idUsuario },
      { $push: { canciones: { idCancion, fecha: fechaActual } } },
      async (err, result) => {
        if (err) {
          const error = crearError(
            "No se ha podido añadir la cancion al historial",
            500
          );
          throw error;
        } else {
          await generarGenerosFavoritos(
            await listarHistorialPorUsuario(idUsuario),
            idUsuario
          );
        }
      }
    );

    if (!existeCancion) {
      const error = new Error("No existe la cancion especificada");
      error.codigo = 403;
      throw error;
    }
  } catch (err) {
    const error = new Error("No se ha podido añadir la cancion al historial");
    error.codigo = 500;
    throw error;
  }
};

module.exports = {
  listarHistorialPorUsuario,
  crearHistorialUsuario,
  reproduccionCancion,
};
