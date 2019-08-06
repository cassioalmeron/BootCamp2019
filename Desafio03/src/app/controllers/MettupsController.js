import Mettup from "../models/Mettup";

class MettupController {
  async store(req, res) {
    const mettup = Mettup.findByPk(req.params.id);
  }
}

export default new MettupController();
