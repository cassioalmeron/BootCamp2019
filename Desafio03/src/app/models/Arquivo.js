import Sequelize, { Model } from "sequelize";

class Arquivo extends Model {
  static init(sequelize) {
    const structure = {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Nome: Sequelize.STRING,
      Caminho: Sequelize.STRING,
    };

    super.init(structure, { sequelize });

    return this;
  }
}

export default Arquivo;
