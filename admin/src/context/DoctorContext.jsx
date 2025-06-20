import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const DoctorContext = createContext(null);
const DoctorContextProvider = ({ children }) => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setdashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backend_url + "/api/doctor/appointments",
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const dtoken = localStorage.getItem("dToken"); // or your actual key name
      const { data } = await axios.post(
        backend_url + "/api/doctor/complete-appointment",
        { appointmentId },
        {
          headers: { dtoken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const dtoken = localStorage.getItem("dToken"); // match your token storage
      const { data } = await axios.post(
        backend_url + "/api/doctor/cancel-appointment",
        { appointmentId },
        {
          headers: { dtoken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backend_url + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success) {
        setdashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backend_url + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    dToken,
    setDToken,
    backend_url,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    getDashData,
    dashData,
    getProfileData,
    profileData
  };
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
