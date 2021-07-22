const express = require("express");
const {
  check,
  validationResult,
  checkSchema,
  body,
} = require("express-validator");
const { listaAmigosPositivos } = require("../../db/controller/amigos");
const {
  getCancion,
  listarCanciones,
  listarCancionesCoincidencias,
} = require("../../db/controller/cancion");

const { crearError } = require("../../utilities/errores");

const router = express.Router();

router.get("/listaAmigos", async (req, res, next) => {
  const { idUsuario } = req;
  try {
    res.json(await listaAmigosPositivos(idUsuario));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
