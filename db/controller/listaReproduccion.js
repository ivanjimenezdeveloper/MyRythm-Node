const { crearError } = require("../../utilities/errores");
const Artista = require("../model/Artista");
const Cancion = require("../model/Cancion");
const Genero = require("../model/Genero");
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

const getListaMegusta = async (idUser) => {
  try {
    const lista = await ListaReproduccion.findOne({
      user: idUser,
      tipo: "Like",
    }).populate("canciones");

    let listaFormateada = await Cancion.populate(lista, {
      path: "canciones.genero",
      model: Genero,
    });

    listaFormateada = await Artista.populate(listaFormateada, {
      path: "canciones.artista",
      model: Artista,
    });

    const { canciones } = listaFormateada;
    return canciones;
  } catch (err) {
    throw crearError("No se ha podido extraer la lista de me gusta", 500);
  }
};

module.exports = {
  listarListasReproduccionPorUsuario,
  crearListaLikeParaUsuario,
  getListaMegusta,
};
