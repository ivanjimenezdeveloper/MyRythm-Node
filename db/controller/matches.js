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

module.exports = {
  listarMatchesPorId,
  crearListaMatches,
  generarMatchesParaUsuario,
};
