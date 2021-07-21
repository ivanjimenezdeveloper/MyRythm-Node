const express = require("express");
const {
  check,
  validationResult,
  checkSchema,
  body,
} = require("express-validator");
const {
  getCancion,
  listarCanciones,
  listarCancionesCoincidencias,
} = require("../../db/controller/cancion");

const { crearError } = require("../../utilities/errores");

const router = express.Router();

router.get(
  "/:idCancion",
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
      const cancion = await getCancion(idCancion);
      res.json(cancion);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const canciones = await listarCanciones();

    if (canciones.length === 0) {
      throw new Error();
    }

    res.json(canciones);
  } catch (err) {
    next(err);
  }
});

router.get(
  "/busquedaCancion/:nombreCancion",
  check("nombreCancion", "Nombre no cumple el formato").isAscii(),
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
    const { nombreCancion } = req.params;

    try {
      const canciones = await listarCancionesCoincidencias(nombreCancion);

      if (canciones.length === 0) {
        res.json({
          estado: true,
          mensaje:
            "No existen canciones que contengan las palabras especificadas",
        });
      }

      res.json(canciones);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
