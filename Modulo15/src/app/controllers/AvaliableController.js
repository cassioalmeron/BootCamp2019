import * as DateFns from "date-fns";
import { Op } from "sequelize";
import Appointment from "../models/Appointment";

import AvailableService from "../services/AvailableService";

class AvaliableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: "Invalid Date" });

    const searchDate = Number(date);

    const avaliable = AvailableService.run({
      date: searchDate,
      provider_id: req.params.providerId
    });

    return res.json(avaliable);
  }
}

export default new AvaliableController();
