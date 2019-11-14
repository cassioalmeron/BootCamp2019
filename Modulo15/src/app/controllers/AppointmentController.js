import Appointment from "../models/Appointment";
import User from "../models/User";
import File from "../models/File";
import Cache from "../../lib/Cache";

import CreateAppointmentService from "../services/CreateAppointmentService";
import CancelAppointmentService from "../services/CancelAppointmentService";

class AppointmentsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const cacheKey = `user:${req.userId}:appointment:${page}`;

    const cached = await Cache.get(cacheKey);
    if (cached) return res.json(cached);

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ["date"],
      attributes: ["id", "date", "past", "cancelable"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            { model: File, as: "avatar", attributes: ["id", "path", "url"] }
          ]
        }
      ]
    });

    await Cache.set(cacheKey, appointments);

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;

    const appointment = await CreateAppointmentService.run({
      provider_id,
      user_id: req.userId,
      date
    });

    return res.json(appointment);
  }

  // async notifyAppointmentProvider(userId, hourStart) {
  //   const user = await User.findByPk(userId);
  //   const formattedDate = DateFns.format(
  //     hourStart,
  //     "'dia' dd 'de' MMMM', às' H:mm'h'",
  //     { locale: pt }
  //   );

  //   return Notification.create({
  //     content: `Novo agendamento de ${user.name} para ${formattedDate}`,
  //     user: userId
  //   });
  // }

  async delete(req, res) {
    //console.log("retorno", appointment);
    const appointment = await CancelAppointmentService.run({
      provider_id: req.params.id,
      user_id: req.userId
    });

    return res.json(appointment);
  }
}

export default new AppointmentsController();
