require("dotenv").config();
const debug = require("debug")("api-myrythm:db:conexion");
const chalk = require("chalk");
const mongoose = require("mongoose");
const {
  listarHistorialPorUsuario,
  reproduccionCancion,
} = require("./controller/historial");
const {
  updatePasswordUsuarioPorId,
  generarGenerosFavoritos,
} = require("./controller/user");

let sesion;

const conectaMongo = async (callback) => {
  mongoose.connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    async (err) => {
      if (err) {
        debug(chalk.red.bold("No se ha podido iniciar la base de datos"));
        debug(chalk.red.bold(err.message));
        return;
      }
      debug(chalk.magentaBright("Base de datos iniciada"));

      reproduccionCancion(
        "60f14180752b265a55524aa9",
        "60f677b956b29b26f4209fd5"
      );
      // callback();
    }
  );
};

module.exports = { conectaMongo, sesion };
