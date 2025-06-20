import React, { useState, useRef, useContext } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
const AddDoctor = () => {
  const { backend_url, aToken } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "General physician",
    degree: "",
    address: "",
    experience: "1 Year",
    fees: "",
    about: "",
  });

  const [doctorImage, setDoctorImage] = useState("");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, //javascript object litral syntax to update the state
      // [name]: value, is a dynamic way to set the property name based on the input field's name attribute.
    }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setDoctorImage(file)
  //   if (file) {
  //   setDoctorImage(file); // ✅ file object, not URL
  // }
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     setDoctorImage(e.target.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("Doctor Image:", doctorImage);
    // Handle form submission here
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("speciality", formData.speciality);
      form.append("degree", formData.degree);
      form.append("address", formData.address);
      form.append("experience", formData.experience);
      form.append("fees", formData.fees);
      form.append("about", formData.about);
      form.append("image", doctorImage); // assuming it's a file/blob

      const response=await axios.post(`${backend_url}/api/admin/add-doctor`, form, {
        headers: {aToken}
      });
      if(!doctorImage){
        return toast.error("Please upload a doctor image");
      }
      if (response.data.success) {
        toast.success("Doctor Added Successfully");
        // Reset form after success
        setFormData({
          name: "",
          email: "",
          password: "",
          speciality: "General physician",
          degree: "",
          address: "",
          experience: "1 Year",
          fees: "",
          about: "",
        });
        setDoctorImage(false);
        fileInputRef.current.value = "";
      } else {
        console.log(response.data.message);
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Server Error. Check backend logs.");
    }
  };

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  const experienceOptions = [
    "1 Year",
    "2 Years",
    "3 Years",
    "4 Years",
    "5 Years",
    "10+ Years",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      <div className="max-w-8xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Add Doctor
        </h1>
        <div className="space-y-6 w-4xl">
          {/* Doctor Image Upload */}
          <div className="flex flex-col items-start">
            <div
              onClick={handleImageClick}
              className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
            >
              {doctorImage ? (
                <img
                  src={URL.createObjectURL(doctorImage)}
                  alt="Doctor"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center">
                  {/* <div>📷</div> */}
                  <img src={assets.doctor_icon} />
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Upload doctor picture</p>
              {/* <p className="text-sm text-gray-600">picture</p> */}
            </div>
            <input
              ref={fileInputRef}
              id="doc-img"
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Speciality */}
            <div>
              <label
                htmlFor="speciality"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Speciality
              </label>
              <select
                id="speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white"
              >
                {specialities.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Doctor Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Degree */}
            <div>
              <label
                htmlFor="degree"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Degree
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                placeholder="Degree"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Set Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Set Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                minLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Address */}
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                rows={3}
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Experience */}
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Experience
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {experienceOptions.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            {/* Fees */}
            <div>
              <label
                htmlFor="fees"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fees
              </label>
              <input
                type="number"
                id="fees"
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                placeholder="Doctor fees"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* About Doctor */}
          <div>
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              About Doctor
            </label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Write about doctor"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add doctor
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;

//    const reader = new FileReader();
// Creates a new FileReader object.

// FileReader is a built-in browser API that can read files (like images, text, PDFs) from the user's device.

//   reader.onload = (e) => {
//     setDoctorImage(e.target.result);
//   };
// Defines what should happen after the file is fully read.

// reader.onload is an event handler that runs when reading is done.

// e.target.result contains the base64-encoded content of the image — suitable to use in an img tag.

// setDoctorImage(...) is probably a React state updater (like useState). You're saving the image data so you can use it somewhere, like showing a preview.

//   reader.readAsDataURL(file);
// Actually starts reading the file, and tells FileReader to read it as a Data URL.

// A Data URL is a string that looks like this:

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
// This format is ideal for showing the image right away in an <img src="..." />.
