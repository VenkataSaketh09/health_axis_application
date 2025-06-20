import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, currency } = useContext(AppContext);
  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded tetx-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b ">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Actions</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt="userimage"
              />
              <p>{item.userData.firstName + " " + item.userData.lastName}</p>
            </div>
            <p className="max-sm:hidden">
              {calculateAge(item.userData.dateOfBirth)}
            </p>
            <p>
              {item.slotDate} at {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-300"
                src={item.doctorData.image}
                alt="doctorimage"
              />
              <p>{item.doctorData.name}</p>
            </div>
            <p>
              {currency} {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-sm font-medium">Cancelled</p>
            ) : item.isCompletd ? (
              <p className="text-green-400 text-sm font-medium">Completed</p>
            ) : (
              <img
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt="cancel icon"
                onClick={() => cancelAppointment(item._id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
