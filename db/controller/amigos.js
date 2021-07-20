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

module.exports = { listarAmigosPorId, crearListaAmigos };
