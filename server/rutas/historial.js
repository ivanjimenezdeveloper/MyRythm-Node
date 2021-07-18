const express = require("express");
const { listarHistorialPorUsuario } = require("../../db/controller/historial");

const router = express.Router();

router.get("/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    const lista = await listarHistorialPorUsuario(idUsuario);

    if (!lista.length) {
      const err = new Error("No existe historial para el usuario especificado");
      err.codigo = 404;
      next(err);
    } else {
      res.json(lista);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
