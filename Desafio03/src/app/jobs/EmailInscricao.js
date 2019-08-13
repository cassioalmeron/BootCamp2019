// import * as DateFns from "date-fns";
// import pt from "date-fns/locale/pt";
import Mail from "../../lib/Mail";
import Mettup from "../models/Mettup";
import UsuarioModel from "../models/Usuario";

class EmailInscricao {
  get key() {
    return "EmailInscricao"; // para cada job precisa de uma chave única
  }

  async handle({ data }) {
    const { usuarioMettup } = data;

    await enviarEmailInscricao(usuarioMettup);
    console.log("A fila de envio de e-mails executou!");
  }
}

export default new EmailInscricao();

export async function enviarEmailInscricao(usuarioMettup) {
  const usuario = await UsuarioModel.findByPk(usuarioMettup.IdUsuario);
  const mettup = await Mettup.findByPk(usuarioMettup.IdMettup, {
    include: [{ model: UsuarioModel, as: "Usuario" }],
  });

  const admin = mettup.Usuario;

  await Mail.sendMail({
    to: `${admin.Nome} <${admin.Email}>`,
    subject: "Inscrição no Mettup",
    // text: "Você tem um novo cancelamento"
    template: "InscricaoMettup",
    context: {
      UsuarioProprietario: admin.Nome,
      Titulo: mettup.Titulo,
      Nome: usuario.Nome,
      Email: usuario.Email,
      // date: DateFns.format(
      //   DateFns.parseISO(appointment.date),
      //   "'dia' dd 'de' MMMM', às' H:mm'h'",
      //   {
      //     locale: pt,
      //   }
      // ),
    },
  });
}
