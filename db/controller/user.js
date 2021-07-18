const User = require("../model/User");

const getUsuario = (idUsuario) => {
  const usuario = User.find({ _id: idUsuario }).populate("generosPreferidos");

  return usuario;
};

const loginUsuario = (username, password) => {
  const usuario = User.findOne({ username, password });

  return usuario || false;
};

module.exports = { getUsuario, loginUsuario };
