const { crearError } = require("../../utilities/errores");
const { shuffle } = require("../../utilities/utils");
const Matches = require("../model/Matches");
const User = require("../model/User");
const {
  getGenerosFavoritos,
  getPersonasCoincidenciaGeneros,
} = require("./user");

const listarMatchesPorId = async (idUsuario) => {
  const lista = await Matches.find({
    user: idUsuario,
  }).populate("matches.idMatch");

  return lista;
};

const crearListaMatches = async (idUser, sesion) => {
  try {
    const matches = await Matches.create({
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

const generarMatchesParaUsuario = async (idUsuario) => {
  const generosUsuario = await getGenerosFavoritos(idUsuario);
  const personasCoincidencia = await await getPersonasCoincidenciaGeneros(
    generosUsuario,
    idUsuario
  );

  const listaTresCoincidencias = [];
  const listaDosCoincidencias = [];
  const listaUnaCoincidencia = [];

  for (const persona of personasCoincidencia) {
    let coincidencias = 0;

    for (const i in generosUsuario.generosPreferidos) {
      if (
        persona.generosPreferidos.includes(generosUsuario.generosPreferidos[i])
      ) {
        coincidencias++;
      }
    }

    if (coincidencias === 3) {
      listaTresCoincidencias.push(persona);
    } else if (coincidencias === 2) {
      listaDosCoincidencias.push(persona);
    } else if (coincidencias === 1) {
      listaUnaCoincidencia.push(persona);
    }
  }

  shuffle(listaTresCoincidencias);
  shuffle(listaDosCoincidencias);
  shuffle(listaUnaCoincidencia);

  return {
    listaTresCoincidencias,
    listaDosCoincidencias,
    listaUnaCoincidencia,
  };
};

const existeEntradaMatch = (listaMatches, idMatchComprobar) => {
  const { matches } = listaMatches;

  for (const match of matches) {
    if (match.idMatch.toString() === idMatchComprobar) {
      return true;
    }
  }

  return false;
};

const cambiaEntrada = (listaMatches, idMatchComprobar, resultado) => {
  const { matches } = listaMatches;

  for (const match of matches) {
    if (match.idMatch.toString() === idMatchComprobar) {
      match.aceptado = resultado;
      return;
    }
  }

  return false;
};

const anyadirMatch = async (idUsuario, idMatch, resultado) => {
  try {
    const matchesUsuario = await Matches.findOne({ user: idUsuario });

    if (!matchesUsuario) {
      throw crearError("No existe el usuario indicado", 404);
    }

    const existeMatch = existeEntradaMatch(matchesUsuario, idMatch, resultado);

    if (existeMatch) {
      cambiaEntrada(matchesUsuario, idMatch, resultado);
      matchesUsuario.save();
      return;
    }
    await Matches.findOneAndUpdate(
      { user: idUsuario },
      { $addToSet: { matches: { idMatch, aceptado: resultado } } }
    );
  } catch (err) {
    if (!err.codigo) {
      throw crearError("No se ha podido añadir el Match", 500);
    }
    throw err;
  }
};

module.exports = {
  listarMatchesPorId,
  crearListaMatches,
  generarMatchesParaUsuario,
  anyadirMatch,
};
