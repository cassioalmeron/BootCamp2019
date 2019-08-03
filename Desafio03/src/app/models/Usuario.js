import Sequelize, { Model } from "sequelize";
import bcript from "bcryptjs";

class Usuario extends Model {
  static init(sequelize) {
    const structure = {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Nome: Sequelize.STRING,
      Email: Sequelize.STRING,
      Senha: Sequelize.VIRTUAL,
      SenhaCriptografada: Sequelize.STRING,
    };

    super.init(structure, { sequelize });

    this.addHook("beforeSave", async usuario => {
      if (usuario.Senha)
        usuario.SenhaCriptografada = await bcript.hash(usuario.Senha, 8);
    });

    return this;
  }

  verificaSenha(senha) {
    return bcript.compare(senha, this.SenhaCriptografada);
  }
}

export default Usuario;
