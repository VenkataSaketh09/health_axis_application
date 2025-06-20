import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">My Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_2fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Payment</p>
          <p>Fee</p>
          <p>Status</p>
          <p>Actions</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_2fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt="patient"
              />
              <p>{item.userData.firstName + " " + item.userData.lastName}</p>
            </div>
            <p className="max-sm:hidden">
              {calculateAge(item.userData.dateOfBirth)}
            </p>
            <p>
              {item.slotDate} at {item.slotTime}
            </p>
            <div className="flex items-center">
              {item.payment ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-green-600 text-xs">Paid</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-red-600 text-xs">Pending</p>
                </div>
              )}
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            <div>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-600 text-xs font-medium">Completed</p>
              ) : (
                <p className="text-blue-600 text-xs font-medium">Scheduled</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {item.cancelled ? (
                <p className="text-gray-400 text-xs">No Actions</p>
              ) : item.isCompleted ? (
                <p className="text-gray-400 text-xs">Completed</p>
              ) : (
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 cursor-pointer hover:scale-110 transition-transform"
                    src={assets.tick_icon}
                    alt="complete"
                    title="Mark as Completed"
                    onClick={() => completeAppointment(item._id)}
                  />
                  <img
                    className="w-8 cursor-pointer hover:scale-110 transition-transform"
                    src={assets.cancel_icon}
                    alt="cancel"
                    title="Cancel Appointment"
                    onClick={() => cancelAppointment(item._id)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;
