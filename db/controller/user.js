const bcrypt = require("bcrypt");
const { crearError } = require("../../utilities/errores");
const User = require("../model/User");

const getUsuario = (idUsuario) => {
  const usuario = User.findOne({ _id: idUsuario });

  return usuario;
};

const updatePasswordUsuarioPorId = async (idUsuario, datos) => {
  const usuario = await getUsuario(idUsuario);
  const passwordModificada = await bcrypt.hash("ayyba", 10);
  const usuarioModificado = await User.findByIdAndUpdate(
    { _id: idUsuario },
    { password: passwordModificada }
  );

  return usuarioModificado;
};
const loginUsuario = async (username, password) => {
  try {
    const usuario = await User.findOne({ username });

    if (!usuario.username) {
      throw crearError("Credenciales incorrectas", 403);
    }

    const contrasenyaCoincide = await bcrypt.compare(
      password,
      usuario.password
    );

    if (typeof contrasenyaCoincide === "undefined") {
      throw crearError("Credenciales incorrectas", 403);
    }

    return usuario;
  } catch (err) {
    throw crearError("No se ha podido comprobar el usuario", 500);
  }
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

const generarGenerosFavoritos = async (historial, idUsuario) => {
  console.log(historial);
  const { canciones } = historial;

  const cancionesOrdenadas = canciones.sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );
  console.log(canciones);

  const generosPorCancion = cancionesOrdenadas.map(
    (cancion) => cancion.idCancion.genero._id
  );

  const cantidadDeIteraciones =
    generosPorCancion.length >= 10 ? 10 : generosPorCancion.length;

  const generosContados = {};

  for (let i = 0; i < cantidadDeIteraciones; i++) {
    if (generosContados[generosPorCancion[i]]) {
      generosContados[generosPorCancion[i]] += 1;
    } else {
      generosContados[generosPorCancion[i]] = 1;
    }
  }

  const generosNombres = Object.getOwnPropertyNames(generosContados);

  console.log(idUsuario, generosNombres);
  try {
    const respuesta = await User.findByIdAndUpdate(idUsuario, {
      generosPreferidos: generosNombres,
    });

    console.log(respuesta);
  } catch (err) {
    throw crearError(
      "No se ha podido generar la lista de generos favoritos",
      500
    );
  }
};

module.exports = {
  getUsuario,
  loginUsuario,
  existeUsername,
  crearUsuario,
  existeEmail,
  updatePasswordUsuarioPorId,
  generarGenerosFavoritos,
};
