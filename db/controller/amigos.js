const Amigos = require("../model/Amigos");

const listarAmigosPorId = async (idUsuario) => {
  const lista = await Amigos.find({
    user: idUsuario,
  }).populate("amigos.idAmigo");

  return lista;
};

module.exports = { listarAmigosPorId };
