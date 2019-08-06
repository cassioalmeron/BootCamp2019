import Sequelize, { Model } from "sequelize";

class UsuarioMettup extends Model {
  static init(sequelize) {
    const structure = {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    };

    super.init(structure, { sequelize });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Mettup, { foreignKey: "IdMettup", as: "Mettup" });
    this.belongsTo(models.Usuario, { foreignKey: "IdUsuario", as: "Usuario" });
  }
}

export default UsuarioMettup;
