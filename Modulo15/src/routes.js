import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
// import User from "./app/models/User";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";
import AppointmentController from "./app/controllers/AppointmentController";
import AvaliableController from "./app/controllers/AvaliableController";

import authMiddleware from "./app/middlewares/auth";
import ScheduleController from "./app/controllers/ScheduleController";
import NotificationController from "./app/controllers/NotificationController";

import validateUserStore from "./app/validators/UserStore";
import validateUserUpdate from "./app/validators/UserUpdate";
import validateSessionStore from "./app/validators/SessionStore";
import validateAppointmentStore from "./app/validators/AppointmentStore";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", validateUserStore, UserController.store);
routes.post("/sessions", validateSessionStore, SessionController.store);

// as rodas declaradas após esta linha utilizarão este middleware automaticamente
routes.use(authMiddleware);

routes.put("/users", validateUserUpdate, UserController.update);

routes.get("/providers", ProviderController.index);
routes.get("/providers/:providerId/available", AvaliableController.index);

routes.get("/appointments", AppointmentController.index);
routes.post(
  "/appointments",
  validateAppointmentStore,
  AppointmentController.store
);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/schedule", ScheduleController.index);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

routes.post("/files", upload.single("file"), FileController.store);

export default routes;
