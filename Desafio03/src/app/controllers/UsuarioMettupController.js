import * as Yup from "yup";
import * as DateFns from "date-fns";
import { Op } from "sequelize";
import Mettup from "../models/Mettup";
import UsuarioMettup from "../models/UsuarioMettup";
import Arquivo from "../models/Arquivo";

class UsuarioMettupController {
  async index(req, res) {
    const data = new Date();

    let mettups = await UsuarioMettup.findAll({
      where: { IdUsuario: req.UsuarioId },
      attributes: [],
      order: [[Mettup, "DataHora"]],
      include: [
        {
          model: Mettup,
          as: "Mettup",
          where: { DataHora: { [Op.gte]: data } },
          attributes: ["Id", "Titulo", "Localizacao", "DataHora"],
        },
      ],
    });

    mettups = mettups.map(x => x.Mettup);

    return res.json(mettups);
  }

  async store(req, res) {
    if (!(await postSchema.isValid(req.body)))
      return res.status(400).json({ Mensagem: "Json inválido!" });

    const { DataHora: dataHora, IdArquivo: idArquivo } = req.body;

    if (dataPassada(dataHora))
      return res.status(401).json({
        Mensagem: "Não é possivel criar um MeetUp para uma data já passada!",
      });

    if (!(await arquivoExiste(idArquivo)))
      return res.status(401).json({
        Mensagem: "Arquivo inexistente!",
      });

    const mettup = {
      ...req.body,
      IdUsuario: req.UsuarioId,
    };
    const retorno = await Mettup.create(mettup);

    return res.json(retorno);
  }

  async update(req, res) {
    if (!(await putSchema.isValid(req.body)))
      return res.status(400).json({ Mensagem: "Json inválido!" });

    const mettup = selecionarMettup(req.params.id, req.UsuarioId);

    if (!mettup)
      return res.status(401).json({
        Mensagem: "Mettup não encontrado!",
      });

    if (dataPassada(mettup.DataHora))
      return res.status(401).json({
        Mensagem: "Mettup já ocorrido!",
      });

    const { DataHora: dataHora, IdArquivo: idArquivo } = req.body;

    if (dataHora && dataPassada(dataHora))
      return res.status(401).json({
        Mensagem: "Não é possivel setar uma data já passada!",
      });

    if (idArquivo && !(await arquivoExiste(idArquivo)))
      return res.status(401).json({
        Mensagem: "Arquivo inexistente!",
      });

    const retorno = await mettup.update(req.body);
    return res.json(retorno);
  }

  async delete(req, res) {
    const mettup = selecionarMettup(req.params.id, req.UsuarioId);

    if (!mettup)
      return res.status(401).json({
        Mensagem: "Mettup não encontrado!",
      });

    const retorno = await mettup.delete();
    return res.json(retorno);
  }
}

function dataPassada(dataHora) {
  const agora = new Date();
  return DateFns.isBefore(dataHora, agora);
}

async function arquivoExiste(idArquivo) {
  return Arquivo.findOne({ where: { Id: idArquivo }, attributes: ["Id"] });
}

async function selecionarMettup(id, idUsuario) {
  return Mettup.findOne({
    where: { Id: req.params.id, IdUsuario: req.UsuarioId },
  });
}

const postSchema = Yup.object().shape({
  IdArquivo: Yup.number().required(),
  Titulo: Yup.string()
    .required()
    .max(50),
  Descricao: Yup.string()
    .required()
    .max(50),
  Localizacao: Yup.string()
    .required()
    .max(50),
  DataHora: Yup.date().required(),
});

const putSchema = Yup.object().shape({
  IdArquivo: Yup.number(),
  Titulo: Yup.string().max(50),
  Descricao: Yup.string().max(50),
  Localizacao: Yup.string().max(50),
  DataHora: Yup.date(),
});

export default new UsuarioMettupController();
