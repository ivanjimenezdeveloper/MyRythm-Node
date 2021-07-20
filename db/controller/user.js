const bcrypt = require("bcrypt");
const { crearError } = require("../../utilities/errores");
const User = require("../model/User");

const getUsuario = (idUsuario) => {
  const usuario = User.find({ _id: idUsuario }).populate("generosPreferidos");

  return usuario;
};

const loginUsuario = (username, password) => {
  const usuario = User.findOne({ username, password });

  return usuario || false;
};

const existeUsername = async (username) => {
  const usuario = await User.findOne({ username });
  return usuario || false;
};

const existeEmail = async (email) => {
  const usuario = await User.findOne({ email });
  return usuario || false;
};
const crearUsuario = async (user, sesion) => {
  const { pass, urlFoto, localizacion, email } = user;
  try {
    const contrasenyaEncriptada = await bcrypt.hash(pass, 10);
    const nuevoUsuario = await User.create({
      username: user.user,
      password: contrasenyaEncriptada,
      urlFoto,
      localizacion,
      email,
    });

    return nuevoUsuario;
  } catch (err) {
    throw crearError("No se ha podido crear el usuario", 500);
  }
};

module.exports = {
  getUsuario,
  loginUsuario,
  existeUsername,
  crearUsuario,
  existeEmail,
};
