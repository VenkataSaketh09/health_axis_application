import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
const Navbar = () => {
  const { aToken, setaToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
    aToken && setaToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-sm ">
        <img
          src={assets.healthAxisLogo}
          alt="logo"
          className="w-36 sm:2-40 cursor-pointer pt-1    "
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-800">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
