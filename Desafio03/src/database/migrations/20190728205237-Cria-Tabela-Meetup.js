module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Mettup", {
      Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      IdArquivo: {
        type: Sequelize.INTEGER,
        references: { model: "Arquivo", key: "Id" },
        onUpdate: "CASCADE",
        // onDelete: "SET NULL",
        allowNull: false,
      },
      IdUsuario: {
        type: Sequelize.INTEGER,
        references: { model: "Usuario", key: "Id" },
        onUpdate: "CASCADE",
        // onDelete: "SET NULL",
        allowNull: false,
      },
      Titulo: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Descricao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Localizacao: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      DataHora: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Mettup");
  },
};
