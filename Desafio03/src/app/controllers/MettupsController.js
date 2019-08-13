import { Op } from "sequelize";
import * as DateFns from "date-fns";
import * as Yup from "yup";
import Mettup from "../models/Mettup";
import Usuario from "../models/Usuario";
import UsuarioMettup from "../models/UsuarioMettup";
import EmailInscricao from "../jobs/EmailInscricao";
import Queue from "../../lib/Queue";
import * as UtilDatas from "../../lib/UtilDatas";

class MettupController {
  async index(req, res) {
    if (!(await getSchema.isValid(req.query)))
      return res.status(400).json({ Mensagem: "Querystring inválida!" });

    const { page = 1, date } = req.query;

    const limit = 10;

    const dataHoraInicial = UtilDatas.horaInicialDia(date);
    const dataHoraFinal = UtilDatas.horaFinalDia(date);

    const mettups = await Mettup.findAll({
      where: { DataHora: { [Op.between]: [dataHoraInicial, dataHoraFinal] } },
      limit,
      offset: (page - 1) * limit,
      attributes: ["Id", "Titulo", "Descricao", "DataHora"],
      include: [
        { model: Usuario, as: "Usuario", attributes: ["Nome", "Email"] },
      ],
    });

    return res.json(mettups);
  }

  async store(req, res) {
    const mettup = await Mettup.findByPk(req.params.id);

    if (!mettup)
      return res.status(404).json({ Mensagem: "Mettup não encontrado!" });

    if (DateFns.isBefore(mettup.DataHora, new Date()))
      return res.status(401).json({
        Mensagem:
          "Não é possível se inscrever neste Mettup porque o mesmo já ocorreu!",
      });

    if (await verificaJaInscrito(req.UsuarioId, req.params.id))
      return res
        .status(401)
        .json({ Mensagem: "Você já está inscrito nesse Mettup!" });

    if (await horarioOcupadoParaInstricao(req.UsuarioId, mettup.DataHora))
      return res.status(401).json({
        Mensagem: "Você já está inscrito em outro Mettup neste horário!",
      });

    let usuarioMettup = {
      IdUsuario: req.UsuarioId,
      IdMettup: req.params.id,
    };

    usuarioMettup = await UsuarioMettup.create(usuarioMettup);

    await Queue.add(EmailInscricao.key, { usuarioMettup });

    return res.json(usuarioMettup);
  }
}

async function verificaJaInscrito(idUsuario, idMettup) {
  const inscricao = await UsuarioMettup.findOne({
    where: { IdUsuario: idUsuario, IdMettup: idMettup },
  });
  return inscricao;
}

async function horarioOcupadoParaInstricao(idUsuario, dataHoraMettup) {
  let umaHoraAntes = DateFns.addHours(dataHoraMettup, -1);
  umaHoraAntes = DateFns.addMinutes(umaHoraAntes, 1);
  let umaHoraDepois = DateFns.addHours(dataHoraMettup, 1);
  umaHoraDepois = DateFns.addMinutes(umaHoraDepois, -1);

  return UsuarioMettup.findOne({
    where: { IdUsuario: idUsuario },
    include: [
      {
        model: Mettup,
        where: { DataHora: { [Op.between]: [umaHoraAntes, umaHoraDepois] } },
      },
    ],
  });
}

const getSchema = Yup.object().shape({
  page: Yup.number(),
  date: Yup.date().required(),
});

export default new MettupController();
