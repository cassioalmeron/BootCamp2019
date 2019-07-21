import jwt from "jsonwebtoken";
import loginConfig from '../../config/login';

export default async (req, res, next)=>{
  const bearer = req.headers.authorization;

  if (!bearer)
    return res.status(401).json({ error: "Token não informado!" });

  const [,token] = bearer.split(" ");

  if (!token)
    return res.status(401).json({ error: "Token não informado!" });

  try {
    const decoded = jwt.verify(token, loginConfig.secret);
    req.UsuarioId = decoded.Id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid!" });
  }
};
