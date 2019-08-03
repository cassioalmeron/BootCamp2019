import Sequelize from "sequelize";
import databaseConfig from "../config/database";

import Usuario from "../app/models/Usuario";
import Arquivo from "../app/models/Arquivo";
import Mettup from "../app/models/Mettup";

const models = [Usuario, Arquivo, Mettup];

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
