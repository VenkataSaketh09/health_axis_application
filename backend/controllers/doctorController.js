import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctorData = await doctorModel.findById(doctorId);
    await doctorModel.findByIdAndUpdate(doctorId, {
      available: !doctorData.available,
    });
    res.json({
      success: true,
      message: "Doctor availability changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error in changing doctor availability",
      error: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get doctorAppointments
// const doctorAppointments = async (req, res) => {
//   try {
//     const doctorId  = req.doctorId;
//     const appointments = await appointmentModel.find({ doctorId });
//     res.json({ success: true, appointments });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// API to get doctorAppointments
const doctorAppointments = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    if (!doctorId) {
      return res.json({ success: false, message: "Doctor ID is missing" });
    }

    const appointments = await appointmentModel
      .find({ doctorId })
      .populate("userId", "-password") // optional: populate patient info
      .sort({ date: -1 }); // optional: latest first

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to mark appointment completed
const appointmentCompleted = async (req, res) => {
  const { appointmentId } = req.body;
  const doctorId = req.doctorId;
  try {
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.doctorId === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to cancel appointment completed
const appointmentCancelled = async (req, res) => {
  const { appointmentId } = req.body;
  const doctorId = req.doctorId;
  try {
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.doctorId === doctorId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get data for doctor dashboard
const doctorDashboard = async (req, res) => {
  try {
    const doctorId = req.doctorId;

    // Fetch all appointments for the doctor
    const appointments = await appointmentModel.find({ doctorId });

    let earnings = 0;
    const patients = new Set();

    appointments.forEach((item) => {
      if (item.isCompleted && item.payment) {
        earnings += item.amount;
      }
      patients.add(item.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.size,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get doctor profile info
const doctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const profileData = await doctorModel
      .findById( doctorId )
      .select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId;
    const { fees, available, address } = req.body;
    await doctorModel.findByIdAndUpdate(doctorId, { fees, available, address });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export {
  changeAvailability,
  doctorList,
  loginDoctor,
  doctorAppointments,
  appointmentCompleted,
  appointmentCancelled,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
};
