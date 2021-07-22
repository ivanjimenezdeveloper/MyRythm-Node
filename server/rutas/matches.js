const express = require("express");
const {
  check,
  validationResult,
  checkSchema,
  body,
} = require("express-validator");
const { generarMatchesParaUsuario } = require("../../db/controller/matches");
const {
  getGenerosFavoritos,
  getPersonasCoincidenciaGeneros,
} = require("../../db/controller/user");
const { crearError } = require("../../utilities/errores");
const { ordenarPorFecha } = require("../../utilities/utils");

const router = express.Router();

router.get(
  "/:idUsuario",
  check("idUsuario", "Id incorrecta").isMongoId(),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      console.log(errores.array());
      const nuevoError = new Error(errores.array().map((error) => error.msg));
      nuevoError.codigo = 400;
      return next(nuevoError);
    }
    next();
  },
  async (req, res, next) => {
    const { idUsuario } = req.params;
    try {
      const listado = await generarMatchesParaUsuario(idUsuario);

      res.json(listado);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
