import * as Yup from 'yup'
import Usuario from "../models/Usuario";

const postSchema = Yup.object().shape({
  Nome:Yup.string().required(),
  Email:Yup.string().email().required(),
  Senha:Yup.string().required().min(6),
});

const putSchema = Yup.object().shape({
  Nome:Yup.string(),
  Email:Yup.string().email(),
  // SenhaAntiga: Yup.string().min(6),
  // Senha: Yup.string()
  //       .min(6)
  //       .when("SenhaAntiga", (SenhaAntiga, field) =>
  //       SenhaAntiga ? field.required() : field
  //       ),
  //     SenhaConfirmacao: Yup.string().when("Senha", (Senha, field) =>
  //     Senha ? field.required().oneOf([Yup.ref("Senha")]) : field
  //     )
});

class UsuarioController {
  async index(req, res){
    const usuarios = await Usuario.findAll();
    return res.json(usuarios);
  }

  async store(req, res){
    if (!(await postSchema.isValid(req.body)))
      return res.status(400).json({Mensagem : "Json inválido!"})

    const emailRepetido = Usuario.findOne({where : { Email : req.body.Email }})

    if (emailRepetido)
      return res.status(401).json({Mensagem:"E-mail já cadastrado!"})

    const usuario = await Usuario.create(req.body)

    const ret = {
      Id: usuario.Id,
      Nome: usuario.Nome,
      Email: usuario.Email
    };

    return res.json(ret);
  }

  async update(req, res){
    if (!(await putSchema.isValid(req.body)))
      return res.status(400).json({Mensagem : "Json inválido!"})

    const usuarioAtual = await Usuario.findByPk(req.UsuarioId)

    const { Email } = req.body;

    if (Email && usuarioAtual.Email!==Email)
    {
      const emailExistente = await Usuario.findOne({where:{Email}})
      if (emailExistente)
        return res.status(401).json({Mensagem:"E-mail já cadastrado!"})
    }

    usuarioAtual.update(req.body);

    return res.json({
      Id: usuarioAtual.Id,
      Nome: usuarioAtual.Nome,
      Email: usuarioAtual.Email,
    });
  }
}

export default new UsuarioController();
