import * as DateFns from "date-fns";
import { Op } from "sequelize";
import Appointment from "../models/Appointment";

class AvaliableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: "Invalid Date" });

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [
            DateFns.startOfDay(searchDate),
            DateFns.endOfDay(searchDate)
          ]
        }
      }
    });

    const schedule = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00"
    ];

    const avaliable = schedule.map(time => {
      const [hour, minute] = time.split(":");
      const value = DateFns.setSeconds(
        DateFns.setMinutes(DateFns.setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: DateFns.format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaliable:
          DateFns.isAfter(value, new Date()) &&
          !appointments.find(a => DateFns.format(a.date, "HH:mm") === time)
      };
    });

    return res.json(avaliable);
  }
}

export default new AvaliableController();
