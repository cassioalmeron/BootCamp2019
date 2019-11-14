import jwt from "jsonwebtoken";
// import promisify from "util";
import authConfig from "../../config/auth";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader)
    return res.status(401).json({ error: "Token not privided!" });

  const [, token] = authHeader.split(" ");

  try {
    // promisify, objetivo de poder utilizar uma função assincrona no padrão antigo (callback) em padrão async/await

    const decoded = jwt.verify(token, authConfig.secret);
    // console.log(token);
    // console.log(authConfig.secret);
    // const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid!" });
  }
};
