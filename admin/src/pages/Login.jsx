import { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("Admin");

  const { setaToken, backend_url } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Handle login logic here
    // console.log(`${state} login attempt:`, { email, password });
    if (state === "Admin") {
      const { data } = await axios.post(backend_url + "/api/admin/login", {
        email,
        password,
      });
      if (data.success) {
        // console.log(data.token)
        localStorage.setItem("aToken", data.token);
        setaToken(data.token);
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(backend_url + "/api/doctor/login", {
        email,
        password,
      });
      if (data.success) {
        console.log(data.token)
        localStorage.setItem("dToken", data.token);
        setDToken(data.token);
      } else {
        toast.error(data.message);
      }
    }
  };

  const handleDoctorLogin = () => {
    // Toggle between Admin and Doctor states
    setState(state === "Admin" ? "Doctor" : "Admin");
    // Clear form fields when switching
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-8">
          <span className="text-blue-500">{state}</span>{" "}
          <span className="text-gray-600">Login</span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600 text-sm">
            {state === "Admin" ? "Doctor Login? " : "Admin Login? "}
          </span>
          <button
            onClick={handleDoctorLogin}
            className="text-blue-500 text-sm hover:text-blue-600 underline focus:outline-none"
          >
            Click here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
