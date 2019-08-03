import Arquivo from "../models/Arquivo";

class ArquivosController {
  async store(req, res) {
    const { filename: Nome, destination: Caminho } = req.file;

    const arquivo = await Arquivo.create({
      Nome,
      Caminho,
    });

    return res.json(arquivo);
  }
}

export default new ArquivosController();
