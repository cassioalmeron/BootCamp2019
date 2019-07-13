import * as DateFns from "date-fns";
import Sequelize, { Model } from "sequelize";

class Appointment extends Model {
  static init(sequelize) {
    const structure = {
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return DateFns.isBefore(this.date, new Date());
        }
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return DateFns.isBefore(new Date(), DateFns.subHours(this.date, 2));
        }
      }
    };

    super.init(structure, { sequelize });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.User, { foreignKey: "provider_id", as: "provider" });
  }
}

export default Appointment;
