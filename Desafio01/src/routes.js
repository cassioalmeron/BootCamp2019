import { Router } from "express";
import ProjectsController from "./app/controllers/ProjectsController";
import TasksController from "./app/controllers/TasksController";

import taskMiddleware from "./app/middlewares/task";
import geralMiddleware from "./app/middlewares/geral";

const routes = new Router();

routes.use(geralMiddleware);

routes.get("/projects", ProjectsController.index);
routes.post("/projects", ProjectsController.store);

routes.use(taskMiddleware);

routes.put("/projects/:id", ProjectsController.update);
routes.delete("/projects/:id", ProjectsController.delete);

routes.post("/projects/:id/tasks", TasksController.store);

export default routes;
