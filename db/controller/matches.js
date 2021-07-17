const Matches = require("../model/Matches");

const listarMatchesPorId = async (idUsuario) => {
  const lista = await Matches.find({
    user: idUsuario,
  }).populate("matches.idMatch");

  return lista;
};

module.exports = { listarMatchesPorId };
