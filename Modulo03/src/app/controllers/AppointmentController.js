import * as Yup from "yup";
import * as DateFns from "date-fns";
import pt from "date-fns/locale/pt";
import Appointment from "../models/Appointment";
import User from "../models/User";
import File from "../models/File";
import Notification from "../schemas/Notification";
// import Mail from "../../lib/mail";
// import Quere from "../../lib/Queue";
import CancellationMail from "../jobs/CancellationMail";
import Queue from "../../lib/Queue";

class AppointmentsController {
  async index(req, res) {
    const { page = 1 } = req.query;

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

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails!" });
    }

    const { provider_id, date } = req.body;

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: "You can only create appointments with providers" });
    }

    if (provider_id == req.userId) {
      return res
        .status(401)
        .json({ error: "You can't create an appointments to yourself" });
    }

    const hourStart = DateFns.startOfHour(DateFns.parseISO(date));
    if (DateFns.isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past dates are not permited!" });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "Appointment date is not available!" });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    // await this.notifyAppointmentProvider(req.userId, hourStart);
    const user = await User.findByPk(req.userId);
    const formattedDate = DateFns.format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: req.userId
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
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"]
        },
        {
          model: User,
          as: "user",
          attributes: ["name"]
        }
      ]
    });

    if (appointment.user_id !== req.userId)
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment."
      });

    const dateWithSub = DateFns.subHours(appointment.date, 2);

    if (DateFns.isBefore(dateWithSub, new Date()))
      return res.status(401).json({
        error: "You can only cancel appointments 2 hours in advance."
      });

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentsController();
