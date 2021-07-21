const express = require("express");
const {
  check,
  validationResult,
  checkSchema,
  body,
} = require("express-validator");
const {
  listarHistorialPorUsuario,
  reproduccionCancion,
} = require("../../db/controller/historial");
const { crearError } = require("../../utilities/errores");

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
      const lista = await listarHistorialPorUsuario(idUsuario);

      if (!lista.canciones.length) {
        next(
          await crearError(
            "No existe historial para el usuario especificado",
            404
          )
        );
      } else {
        res.json(lista);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/reproducirCancion/:idCancion",
  check("idCancion", "Id incorrecta").isMongoId(),
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
    const { idCancion } = req.params;

    try {
      reproduccionCancion(idCancion, req.idUsuario);
      res.json({ estado: true });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
