import Sequelize, { Model } from "sequelize";
import bcript from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    const structure = {
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.BOOLEAN
    };

    super.init(structure, { sequelize });

    this.addHook("beforeSave", async user => {
      if (user.password) {
        user.password_hash = await bcript.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: "avatar_id", as: "avatar" });
  }

  checkPassword(password) {
    return bcript.compare(password, this.password_hash);
  }
}

export default User;
