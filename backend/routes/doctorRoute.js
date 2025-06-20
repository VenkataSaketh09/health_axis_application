import express from "express";
import {
  doctorList,
  loginDoctor,
  doctorAppointments,
  appointmentCancelled,
  appointmentCompleted,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter = express.Router();
doctorRouter.get("/doctors", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments", authDoctor, doctorAppointments);
doctorRouter.post("/complete-appointment", authDoctor, appointmentCompleted);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancelled);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
export default doctorRouter;
