import Sequelize, { Model } from "sequelize";

class Mettup extends Model {
  static init(sequelize) {
    const structure = {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Titulo: Sequelize.STRING,
      Descricao: Sequelize.STRING,
      Localizacao: Sequelize.STRING,
      DataHora: Sequelize.DATE,
    };

    super.init(structure, { sequelize });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Arquivo, { foreignKey: "IdArquivo", as: "Banner" });
    this.belongsTo(models.Usuario, { foreignKey: "IdUsuario", as: "Usuario" });
  }
}

export default Mettup;
