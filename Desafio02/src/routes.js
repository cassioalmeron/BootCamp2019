import { Router } from "express";
import autenticacao from "./app/middlewares/autenticacao";
import UsuarioController from "./app/controllers/UsuarioController";
import SessaoController from "./app/controllers/SessaoController";

const routes = new Router();

routes.get("/usuarios", UsuarioController.index);
routes.post("/usuarios", UsuarioController.store);
routes.post("/sessao", SessaoController.store);

routes.use(autenticacao);

routes.put("/usuarios", UsuarioController.update);

export default routes;
