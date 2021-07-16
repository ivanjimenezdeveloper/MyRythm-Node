require("dotenv").config();
const express = require("express");
const cors = require("cors");
const debug = require("debug")("api-myrythm:servidor:init");
const chalk = require("chalk");
const morganfreeman = require("morgan");

const app = express();

const puerto = process.env.PORT || process.env.PUERTO_SERVIDOR || 5000;

const iniciaServidor = () => {
  const servidor = app.listen(puerto, () => {
    debug(chalk.yellow(`Servidor iniciado en el puerto ${puerto}`));
  });

  app.use(morganfreeman("dev"));
  app.use(cors());
  app.use(express.json());

  app.get("/activo", (req, res, next) => {
    res.json({ mensaje: "saliendo del poso" });
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
