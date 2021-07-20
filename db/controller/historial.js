const Cancion = require("../model/Cancion");
const Genero = require("../model/Genero");
const Historial = require("../model/Historial");

const listarHistorialPorUsuario = async (idUser) => {
  try {
    const lista = await Historial.find({
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

module.exports = { listarHistorialPorUsuario, crearHistorialUsuario };
