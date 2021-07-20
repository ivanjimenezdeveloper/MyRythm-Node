const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { crearListaAmigos } = require("../../db/controller/amigos");
const { crearHistorialUsuario } = require("../../db/controller/historial");
const {
  crearListaLikeParaUsuario,
} = require("../../db/controller/listaReproduccion");
const { crearListaMatches } = require("../../db/controller/matches");
const {
  loginUsuario,
  getUsuario,
  existeUsername,
  existeEmail,
  crearUsuario,
} = require("../../db/controller/user");
const { crearError } = require("../../utilities/errores");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { user, pass } = req.body;
  try {
    const resultadoUsuario = await loginUsuario(user, pass);

    if (!resultadoUsuario) {
      const err = new Error("el nombre de usuario o contraseña no coincide");
      err.codigo = 400;
      next(err);
    } else {
      const resultadoUsuarioSeguro = {
        _id: resultadoUsuario._id,
        username: resultadoUsuario.username,
        urlFoto: resultadoUsuario.urlFoto,
        localizacion: resultadoUsuario.localizacion,
        email: resultadoUsuario.email,
      };
      const token = jwt.sign(
        { usuario: resultadoUsuarioSeguro },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      res.json({ token });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/registro", async (req, res, next) => {
  const { user, pass, urlFoto, localizacion, email } = req.body;
  const usuarioObjeto = {
    user,
    pass,
    urlFoto,
    localizacion,
    email,
  };
  try {
    const resultadoEmail = await existeEmail(email);

    if (resultadoEmail)
      throw crearError(
        "No se puede crear un usuario debido a que ya esta registrado el email",
        403
      );

    const existeUsuario = await existeUsername(user);

    if (existeUsuario)
      throw crearError(
        "No se puede crear un usuario debido a que ya esta registrado el nombre de usuario",
        403
      );

    const nuevoUsuario = await crearUsuario(usuarioObjeto);
    const idUsuario = nuevoUsuario.id;

    await crearListaAmigos(idUsuario);
    await crearListaMatches(idUsuario);
    await crearHistorialUsuario(idUsuario);
    await crearListaLikeParaUsuario(idUsuario);

    res.json({ ok: true, mensaje: `Usuario ${user} creado con exito` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
