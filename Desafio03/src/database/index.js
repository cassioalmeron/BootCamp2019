import Sequelize from "sequelize";
import databaseConfig from "../config/database";

import Usuario from "../app/models/Usuario";
import Arquivo from "../app/models/Arquivo";
import Mettup from "../app/models/Mettup";
import UsuarioMettup from "../app/models/UsuarioMettup";

const models = [Usuario, Arquivo, Mettup, UsuarioMettup];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
