import * as DateFns from "date-fns";

import User from "../models/User";
import Appointment from "../models/Appointment";

import CancellationMail from "../jobs/CancellationMail";
import Queue from "../../lib/Queue";
import Cache from "../../lib/Cache";

class CancelAppointmentService {
  async run({ provider_id, user_id }) {
    let appointment = await Appointment.findByPk(provider_id, {
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

    if (appointment.user_id !== user_id)
      throw new Error("You don't have permission to cancel this appointment.");

    const dateWithSub = DateFns.subHours(appointment.date, 2);

    if (DateFns.isBefore(dateWithSub, new Date()))
      throw new Error("You can only cancel appointments 2 hours in advance.");

    appointment.canceled_at = new Date();

    appointment = await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CancelAppointmentService();
