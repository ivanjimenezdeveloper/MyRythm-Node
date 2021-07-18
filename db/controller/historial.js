const Cancion = require("../model/Cancion");
const Genero = require("../model/Genero");
const Historial = require("../model/Historial");

const listarHistorialPorUsuario = async (idUsuario) => {
  try {
    const lista = await Historial.find({
      user: idUsuario,
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

module.exports = { listarHistorialPorUsuario };
