import { createContext, useState, useEffect, use } from "react";
import { doctors } from "../assets/assets";
import axios from "axios";
import App from "../App";
import { toast } from "react-toastify";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const currencySymbol = "₹";
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backend_url + "/api/doctor/doctors");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching doctors data:", error);
      toast.error("Error fetching doctors data: " + error.message);
    }
  };

  const loadUserprofileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(backend_url + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error loading user profile data:", error);
      toast.error("Error loading user profile data: " + error.message);
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);
  useEffect(() => {
    if (token) {
      loadUserprofileData();
    } else {
      setUserData(false);
    }
  }, [token]);
  const value = {
    doctors,
    currencySymbol,
    getDoctorsData,
    token,
    setToken,
    backend_url,
    userData,
    setUserData,
    loadUserprofileData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContextProvider;
