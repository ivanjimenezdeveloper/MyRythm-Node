const Artista = require("../model/Artista");

const listarArtistas = async () => {
  const lista = await Artista.find();

  return lista;
};

module.exports = { listarArtistas };
