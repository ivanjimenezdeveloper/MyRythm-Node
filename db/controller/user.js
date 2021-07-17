const User = require("../model/User");

const getUsuario = (idUsuario) => {
  const usuario = User.find({ _id: idUsuario }).populate("generosPreferidos");

  return usuario;
};

module.exports = { getUsuario };
