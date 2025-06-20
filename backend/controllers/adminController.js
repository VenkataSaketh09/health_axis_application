import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
//API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log(imageFile);
    // console.log({name,email,password,speciality,degree,experience,about,available,fees,address},imageFile)
    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageURL = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageURL,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      available: true,
      fees,
      address,
      date: Date.now(),
    };
    const doctorUpload = new doctorModel(doctorData);
    await doctorUpload.save();
    return res.json({ success: true, message: "successfully uploaded data" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//ApI  to get All doctors for admin panel
const AllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//API to get All Appointments
const adminAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    // console.log(appointments)
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to cancel the appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required",
      });
    }
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    //releasing doctor slot
    const { doctorId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(doctorId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latest_appointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  AllDoctors,
  adminAppointments,
  appointmentCancel,
  adminDashboard
};
