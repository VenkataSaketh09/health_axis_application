import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext(null);
const AdminContextProvider = ({ children }) => {
  const [aToken, setaToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData,setDashData]=useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backend_url}/api/admin/all-doctors`,
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (doctorId) => {
    try {
      const { data } = await axios.post(
        backend_url + "/api/admin/change-availability",
        { doctorId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        backend_url + "/api/admin/appointments",
        { headers: { aToken } }
      );
      if (data.success) {
        console.log(data.appointments);
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backend_url + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backend_url + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if(data.success){
        setDashData(data.dashData)
        console.log(data.dashData)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message)
    }
  }
    

  return (
    <AdminContext.Provider
      value={{
        aToken,
        setaToken,
        backend_url,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,getDashData
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
