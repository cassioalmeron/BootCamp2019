import "dotenv";
import "./database";
import { enviarEmailInscricao } from "./app/jobs/EmailInscricao";
import UsuarioMettup from "./app/models/UsuarioMettup";

async function teste() {
  const usuarioMettup = await UsuarioMettup.findByPk(13);
  await enviarEmailInscricao(usuarioMettup);
}

teste();
