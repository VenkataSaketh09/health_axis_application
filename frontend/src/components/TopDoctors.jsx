import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Clock } from "lucide-react";
const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-bold">
        Top <span className="text-blue-600">Doctors</span> to Book
      </h1>
      <p className="sm:w-2/3 text-center text-base">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((value, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${value._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <img src={value.image} alt="image" className="bg-blue-50" />
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
              <p className="text-gray-900 text-lg font-medium">{value.name}</p>
              <p className="text-blue-900 text-base ">{value.speciality}</p>
              <div className="flex items-center text-blue-500 text-sm">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                {value.experience}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;
