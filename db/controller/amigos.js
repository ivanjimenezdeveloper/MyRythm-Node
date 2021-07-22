const { crearError } = require("../../utilities/errores");
const Amigos = require("../model/Amigos");

const listarAmigosPorId = async (idUsuario) => {
  const lista = await Amigos.find({
    user: idUsuario,
  }).populate("amigos.idAmigo");

  return lista;
};

const crearListaAmigos = (idUser) => {
  try {
    const amigos = Amigos.create({
      amigos: [],
      user: idUser,
    });
  } catch (err) {
    const error = new Error("No se ha podido crear la lista de amigos");
    error.codigo = 500;
    throw error;
  }
  return true;
};

const existeMatchPositivo = async (idUsuario, idAmigo) => {
  const amigosUsuario = await Amigos.findOne({ user: idUsuario._id });
  for (const amigo of amigosUsuario.amigos) {
    if (amigo.idAmigo._id.toString() === idAmigo) {
      if (amigo.aceptado) {
        return { estado: true, usuario: idUsuario };
      }
      return { estado: false };
    }
  }

  return false;
};

const getMatchesPositivos = async ({ amigos }, idUsuario) => {
  const listaPositivos = [];
  const listaPromesas = [];
  try {
    for (const amigo of amigos) {
      if (amigo.aceptado) {
        listaPromesas.push(existeMatchPositivo(amigo.idAmigo, idUsuario));
      }
    }
  } catch (err) {
    throw crearError("Error garrafal", 500);
  }
  const listaPromesasResueltas = await Promise.all(listaPromesas);

  for (const persona of listaPromesasResueltas) {
    if (persona.estado) listaPositivos.push(persona.usuario);
  }

  return listaPositivos;
};

const listaAmigosPositivos = async (idUsuario) => {
  try {
    const amigosUsuario = await Amigos.findOne({ user: idUsuario }).populate(
      "amigos.idAmigo",
      "-password"
    );
    if (amigosUsuario.amigos.length === 0) {
      return [];
    }
    const listaMatches = await getMatchesPositivos(amigosUsuario, idUsuario);

    return listaMatches;
  } catch (err) {
    throw crearError("No se ha podido extraer la lista de amigos", 500);
  }
};

module.exports = { listarAmigosPorId, crearListaAmigos, listaAmigosPositivos };
