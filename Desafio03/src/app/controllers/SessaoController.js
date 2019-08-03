import * as Yup from "yup";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";
import loginConfig from "../../config/login";

const postSchema = Yup.object().shape({
  Email: Yup.string()
    .email()
    .required(),
  Senha: Yup.string()
    .required()
    .min(6),
});

class SessaoController {
  async store(req, res) {
    if (!(await postSchema.isValid(req.body)))
      return res.status(400).json({ Mensagem: "Json inválido!" });

    const usuario = await Usuario.findOne({ where: { Email: req.body.Email } });

    if (!usuario)
      return res.status(401).json({ Mensagem: "Usuário não encontrado!" });

    if (!(await usuario.verificaSenha(req.body.Senha)))
      return res.status(401).json({ Mensagem: "Senha inválida!" });

    // primeiro parâmetro do sign: payload
    // segundo parâmetro: texto único
    // terceiro parâmetro: configurações
    const token = jwt.sign({ Id: usuario.Id }, loginConfig.secret, {
      expiresIn: loginConfig.expiresIn,
    });

    const retorno = {
      Id: usuario.Id,
      Nome: usuario.Nome,
      Email: usuario.Email,
      token,
    };

    return res.json(retorno);
  }
}

export default new SessaoController();
