import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  payAppointment,

  addBpReading,
  getBpReadings,
  getBpAnalytics,
  updateBpReading,
  deleteBpReading,

 addGlucoseReading,
 getGlucoseAnalytics,
 getGlucoseReadings,
 getGlucoseTrends,
 updateGlucoseReading,
 deleteGlucoseReading,

 addPulseReading,
 getPulseReadings,
 getPulseAnalytics,
 updatePulseReading,
 deletePulseReading,

} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
const userRouter = express.Router();

//API endpoint to register user
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateUserProfile
);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments",authUser, listAppointment);
userRouter.post('/cancel-appointment',authUser,cancelAppointment);
userRouter.post('/pay-appointment',authUser,payAppointment);

//BP monitoring
userRouter.post("/bp-readings", authUser, addBpReading);
userRouter.get("/bp-readings", authUser, getBpReadings);
userRouter.get("/bp-analytics", authUser, getBpAnalytics);
userRouter.put("/bp-readings/:readingId", authUser, updateBpReading);
userRouter.delete("/bp-readings/:readingId", authUser, deleteBpReading);


// Diabetes monitoring routes
userRouter.post("/glucose-readings", authUser, addGlucoseReading);
userRouter.get("/glucose-readings", authUser, getGlucoseReadings);
userRouter.get("/glucose-analytics", authUser, getGlucoseAnalytics);
userRouter.put("/glucose-readings/:readingId", authUser, updateGlucoseReading);
userRouter.delete("/glucose-readings/:readingId", authUser, deleteGlucoseReading);
userRouter.get("/glucose-trends", authUser, getGlucoseTrends);

//Pulse monitoring
userRouter.post("/pulse-readings", authUser, addPulseReading);
userRouter.get("/pulse-readings", authUser, getPulseReadings);
userRouter.get("/pulse-analytics", authUser, getPulseAnalytics);
userRouter.put("/pulse-readings/:readingId", authUser, updatePulseReading);
userRouter.delete("/pulse-readings/:readingId", authUser, deletePulseReading);

export default userRouter;
