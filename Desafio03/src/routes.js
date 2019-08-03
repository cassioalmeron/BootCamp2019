import { Router } from "express";
import multer from "multer";

import autenticacao from "./app/middlewares/autenticacao";
import multerConfig from "./config/multer";
import UsuarioController from "./app/controllers/UsuarioController";
import SessaoController from "./app/controllers/SessaoController";
import ArquivoController from "./app/controllers/ArquivoController";
import UsuarioMettupController from "./app/controllers/UsuarioMettupController";

const routes = new Router();
const upload = multer(multerConfig);

routes.get("/usuarios", UsuarioController.index);
routes.post("/usuarios", UsuarioController.store);
routes.post("/sessao", SessaoController.store);

routes.use(autenticacao);

routes.put("/usuarios", UsuarioController.update);
routes.post("/Arquivos", upload.single("file"), ArquivoController.store);
// routes.post("/arqArquivosuivos", ArquivoController.store);

routes.post("/Mettups", ArquivoController.store);

routes.get("/Usuario/Mettups", UsuarioMettupController.index);
routes.post("/Usuario/Mettups", UsuarioMettupController.store);
routes.put("/Usuario/Mettups", UsuarioMettupController.update);
routes.delete("/Usuario/Mettups", UsuarioMettupController.delete);

export default routes;
