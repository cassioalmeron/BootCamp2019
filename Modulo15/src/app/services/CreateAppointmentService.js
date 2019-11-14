import * as DateFns from "date-fns";
import pt from "date-fns/locale/pt";

import User from "../models/User";
import Appointment from "../models/Appointment";

import Notification from "../schemas/Notification";

import Cache from "../../lib/Cache";

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!checkIsProvider) {
      throw new Error("You can only create appointments with providers");
    }

    if (provider_id == user_id) {
      throw new Error("You can't create an appointments to yourself");
    }

    const hourStart = DateFns.startOfHour(DateFns.parseISO(date));
    if (DateFns.isBefore(hourStart, new Date())) {
      throw new Error("Past dates are not permited");
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      throw new Error("Appointment date is not available!");
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date
    });

    // await this.notifyAppointmentProvider(req.userId, hourStart);
    const user = await User.findByPk(user_id);
    const formattedDate = DateFns.format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: user_id
    });

    await Cache.invalidatePrefix(`user:${user.id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
