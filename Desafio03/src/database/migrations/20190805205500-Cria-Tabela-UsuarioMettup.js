module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("UsuarioMettup", {
      Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      IdUsuario: {
        type: Sequelize.INTEGER,
        references: { model: "Usuario", key: "Id" },
        onUpdate: "CASCADE",
        // onDelete: "SET NULL",
        allowNull: false,
      },
      IdMettup: {
        type: Sequelize.INTEGER,
        references: { model: "Mettup", key: "Id" },
        onUpdate: "CASCADE",
        // onDelete: "SET NULL",
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
    return queryInterface.dropTable("UsuarioMettup");
  },
};
