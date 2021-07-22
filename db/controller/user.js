const bcrypt = require("bcrypt");
const { crearError } = require("../../utilities/errores");
const { ordenarPorFecha } = require("../../utilities/utils");
const User = require("../model/User");

const getUsuario = async (idUsuario) => {
  const usuario = await User.findOne({ _id: idUsuario })
    .select("-password")
    .populate("localizacion generosPreferidos");

  return usuario;
};

const updatePasswordUsuarioPorId = async (idUsuario, datos) => {
  const usuario = await getUsuario(idUsuario);
  const passwordModificada = await bcrypt.hash(datos, 10);
  const usuarioModificado = await User.findByIdAndUpdate(
    { _id: idUsuario },
    { password: passwordModificada }
  );

  return usuarioModificado;
};
const loginUsuario = async (username, password) => {
  try {
    const usuario = await User.findOne({ username }).populate(
      "localizacion generosPreferidos"
    );

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
const crearUsuario = async (user) => {
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

const contarGenerosPorHistorial = (generosPorCancion) => {
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
  return Object.getOwnPropertyNames(generosContados);
};

const generarGenerosFavoritos = async (historial, idUsuario) => {
  const { canciones } = historial;

  const cancionesOrdenadas = canciones.sort(ordenarPorFecha);

  const generosPorCancion = cancionesOrdenadas.map(
    (cancion) => cancion.idCancion.genero._id
  );

  const generosNombres = contarGenerosPorHistorial(generosPorCancion);
  try {
    const respuesta = await User.findByIdAndUpdate(idUsuario, {
      generosPreferidos: generosNombres,
    });

    return true;
  } catch (err) {
    throw crearError(
      "No se ha podido generar la lista de generos favoritos",
      500
    );
  }
};

const getGenerosFavoritos = async (idUsuario) => {
  const generos = await User.findById(idUsuario).select(
    "generosPreferidos -_id"
  );

  return generos;
};

const getPersonasCoincidenciaGeneros = async (
  { generosPreferidos },
  idUsuario
) => {
  console.log(generosPreferidos);
  const personas = await User.find({
    generosPreferidos: { $in: generosPreferidos },
    _id: { $ne: idUsuario },
  }).select("-password");

  return personas;
};

module.exports = {
  getUsuario,
  loginUsuario,
  existeUsername,
  crearUsuario,
  existeEmail,
  updatePasswordUsuarioPorId,
  generarGenerosFavoritos,
  getGenerosFavoritos,
  getPersonasCoincidenciaGeneros,
};
