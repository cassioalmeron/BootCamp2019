import * as DateFns from "date-fns";
import { Op } from "sequelize";
import Appointment from "../models/Appointment";
import User from "../models/User";

class ScheduleController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkIsProvider)
      return res.status(401).json({ error: "User is not a provider" });

    const { date } = req.query;
    const parsedDate = DateFns.parseISO(date);

    console.log(parsedDate);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            DateFns.startOfDay(parsedDate),
            DateFns.endOfDay(parsedDate)
          ]
        }
      },
      include: [{ model: User, as: "user", attributes: ["name"] }]
    });

    console.log("Appointments:", appointments);
    return res.json(appointments);
  }
}

export default new ScheduleController();
