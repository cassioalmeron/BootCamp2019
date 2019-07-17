import { Request } from "express";
import ProjectsStore from "../ProjectsStore";

export default async (req: Request, res, next) => {
  const [, , id] = req.url.split("/");

  if (!ProjectsStore.projects.find(x => x.id == id))
    return res.status(401).json({ error: "Projeto não encontrado!" });

  return next();
};
