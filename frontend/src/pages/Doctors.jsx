import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Clock } from "lucide-react";
const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState([]);

  // List of specialities for easier management
  const specialities = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  const handleSpecialityClick = (selectedSpeciality) => {
    // If clicking the same specialty, show all doctors; otherwise filter by specialty
    if (speciality === selectedSpeciality) {
      navigate("/doctors");
    } else {
      navigate(`/doctors/${selectedSpeciality}`);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="mb-20">
      <p className="text-gray-600">Browse through the Doctors Specialist</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-blue-600 text-white" : ""
          }`}
        >
          Filters
        </button>
        <div
          className={`${
            showFilter ? "flex" : "hidden"
          } sm:flex flex-col gap-4 text-sm text-gray-600`}
        >
          {specialities.map((spec) => (
            <p
              key={spec}
              onClick={() => handleSpecialityClick(spec)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-1 border border-gray-300 rounded transition-all cursor-pointer hover:bg-blue-50 ${
                speciality === spec
                  ? "bg-blue-100 text-blue-600 border-blue-300"
                  : "hover:border-blue-200"
              }`}
            >
              {spec}
            </p>
          ))}
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((value, index) => (
            <div
              key={value._id || index} // Use _id if available, fallback to index
              onClick={() => navigate(`/appointment/${value._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img
                src={value.image}
                alt={`Dr. ${value.name}`}
                className="bg-blue-50 w-full h-48 object-cover"
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    value.available ? "text-green-500" : "text-red-600"
                  }`}
                >
                  <p
                    className={`w-2 h-2  ${
                      value.available
                        ? "bg-green-500 rounded-full"
                        : "bg-red-600 rounded-full"
                    }`}
                  ></p>
                  <p>{value.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">
                  {value.name}
                </p>
                <p className="text-blue-900 text-base">{value.speciality}</p>
                <div className="flex items-center text-blue-500 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  {value.experience}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
