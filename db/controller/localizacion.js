const Localizacion = require("../model/Localizacion");

const listarLocalizaciones = async () => {
  const lista = await Localizacion.find();

  return lista;
};

module.exports = { listarLocalizaciones };
