module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Arquivo", {
      Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      Nome: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Caminho: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true,
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
    return queryInterface.dropTable("Arquivo");
  },
};
