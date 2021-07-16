const Genero = require("../model/Genero");

const listarGeneros = async () => {
  const generos = await Genero.find();
  return generos;
};

module.exports = { listarGeneros };
