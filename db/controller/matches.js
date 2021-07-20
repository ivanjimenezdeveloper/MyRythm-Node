const Matches = require("../model/Matches");

const listarMatchesPorId = async (idUsuario) => {
  const lista = await Matches.find({
    user: idUsuario,
  }).populate("matches.idMatch");

  return lista;
};

const crearListaMatches = (idUser, sesion) => {
  try {
    const matches = Matches.create({
      matches: [],
      user: idUser,
    });
  } catch (err) {
    const error = new Error("No se ha podido crear la lista de matches");
    error.codigo = 500;
    throw error;
  }
  return true;
};

module.exports = { listarMatchesPorId, crearListaMatches };
