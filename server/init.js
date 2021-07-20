require("dotenv").config();
const express = require("express");
const cors = require("cors");
const debug = require("debug")("api-myrythm:servidor:init");
const chalk = require("chalk");
const morganfreeman = require("morgan");
const jwt = require("jsonwebtoken");
const { listarGeneros } = require("../db/controller/genero");
const { listarAmigosPorId } = require("../db/controller/amigos");
const { listarMatchesPorId } = require("../db/controller/matches");
const { listarArtistas } = require("../db/controller/artista");
const {
  listarListasReproduccionPorUsuario,
} = require("../db/controller/listaReproduccion");
const { listarLocalizaciones } = require("../db/controller/localizacion");
const routerUsuario = require("./rutas/user");
const routerHistorial = require("./rutas/historial");

const app = express();

const puerto = process.env.PORT || process.env.PUERTO_SERVIDOR || 5000;

const authMiddleware = (req, res, next) => {
  if (!req.header("Authorization")) {
    const nuevoError = new Error("Petición no autentificada");
    nuevoError.codigo = 403;
    return next(nuevoError);
  }
  const token = req.header("Authorization").split(" ")[1];
  try {
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = datosToken.usuario._id;
    req.idUsuario = id;
    next();
  } catch (e) {
    // Token incorrecto
    if (e.message.includes("expired")) {
      const nuevoError = new Error("Token caducado");
      nuevoError.codigo = 403;
      return next(nuevoError);
    }

    const nuevoError = new Error("Token erroeno");
    nuevoError.codigo = 403;
    next(e);
  }
};

const iniciaServidor = () => {
  const servidor = app.listen(puerto, () => {
    debug(chalk.yellow(`Servidor iniciado en el puerto ${puerto}`));
  });

  app.use(morganfreeman("dev"));
  app.use(cors());
  app.use(express.json());

  app.use("/usuario", routerUsuario);
  app.use("/historial", authMiddleware, routerHistorial);

  app.get("/generos", async (req, res, next) => {
    const generos = await listarGeneros();
    res.json(generos);
  });

  app.get("/amigos/:idUsuario", async (req, res, next) => {
    const { idUsuario } = req.params;
    const lista = await listarAmigosPorId(idUsuario);

    res.json(lista);
  });

  app.get("/matches/:idUsuario", async (req, res, next) => {
    const { idUsuario } = req.params;
    const lista = await listarMatchesPorId(idUsuario);

    res.json(lista);
  });

  app.get("/artista/artistas", async (req, res, next) => {
    const lista = await listarArtistas();

    res.json(lista);
  });

  app.get("/listasReproduccion/:idUsuario", async (req, res, next) => {
    const { idUsuario } = req.params;
    const lista = await listarListasReproduccionPorUsuario(idUsuario);

    res.json(lista);
  });

  app.get("/localizacion/localizaciones", async (req, res, next) => {
    const lista = await listarLocalizaciones();

    res.json(lista);
  });

  servidor.on("error", (err) => {
    debug(
      chalk.red.bold(`Error al iniciar el servidor en el puerto ${puerto}`)
    );
    if (err.code === "EADDRINUSE") {
      debug(chalk.red.bold(`El puerto ${puerto} está ocupado`));
    }
  });

  app.use((err, req, res, next) => {
    const codigo = err.codigo || 500;
    const mensaje = err.codigo ? err.message : "Pete general";
    console.log(err.message);
    res.status(codigo).json({ error: true, mensaje });
  });
};

module.exports = {
  app,
  iniciaServidor,
};
