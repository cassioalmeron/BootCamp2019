import User from "../models/User";
import File from "../models/File";
import Cache from "../../lib/Cache";

class UserController {
  async store(req, res) {
    // isso gera um select com todos os campos só para verificar se existe, não gostei!
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists)
      return res.status(400).json({ error: "User already exists!" });

    const user = await User.create(req.body);
    const { id, name, email, provider } = user;

    if (provider) await Cache.invalidate("providers");

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email }
      });

      if (userExists)
        return res.status(400).json({ error: "User already exists!" });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(401).json({ error: "Old password does not match!" });

    await user.update(req.body);
    // const { id, name, provider } = await user.update(req.body);
    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"]
        }
      ]
    });

    return res.json({
      id,
      name,
      email,
      avatar
    });
  }
}

export default new UserController();
