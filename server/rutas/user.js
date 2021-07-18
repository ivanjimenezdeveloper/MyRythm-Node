const express = require("express");
const jwt = require("jsonwebtoken");
const { loginUsuario, getUsuario } = require("../../db/controller/user");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { user, pass } = req.body;
  const resultadoUsuario = await loginUsuario(user, pass);

  if (!resultadoUsuario) {
    const err = new Error("el nombre de usuario o contraseña no coincide");
    err.codigo = 400;
    next(err);
  } else {
    const token = jwt.sign(
      { usuario: resultadoUsuario },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.json({ token });
  }
});

router.get("/usuario/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  const lista = await getUsuario(idUsuario);

  res.json(lista);
});

module.exports = router;
