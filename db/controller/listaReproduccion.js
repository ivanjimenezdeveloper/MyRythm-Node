const ListaReproduccion = require("../model/ListaReproduccion");

const listarListasReproduccionPorUsuario = async (idUser) => {
  const lista = await ListaReproduccion.find({
    user: idUser,
  }).populate("canciones");

  return lista;
};

const crearListaLikeParaUsuario = async (idUser, sesion) => {
  try {
    const lista = ListaReproduccion.create({
      canciones: [],
      user: idUser,
      tipo: "Like",
    });
  } catch (err) {
    const error = new Error(
      'No se ha podido crear la lista de reproduccion "Like" para el usuario indicado'
    );
    error.codigo = 500;
    throw error;
  }
  return true;
};

module.exports = {
  listarListasReproduccionPorUsuario,
  crearListaLikeParaUsuario,
};
