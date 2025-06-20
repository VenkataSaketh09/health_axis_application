import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
const DoctorDashboard = () => {
  const { dToken, dashData, getDashData,completeAppointment,cancelAppointment } = useContext(DoctorContext);
  const {currency}=useContext(AppContext)
  useEffect(() => {
    if (dToken) {
      getDashData();
      // console.log(dashData)
    }
  }, [dToken]);
  return (
    dashData && (
      <div className="mt-5 ml-11">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gary-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="doctor" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}{dashData.earnings}
              </p>
              <p className="text-gray-500">Earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gary-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.appointments_icon}
              alt="appointments"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-500">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gary-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="patient" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-500">Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="listIcon" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments?.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.userData.image}
                  alt="doctor"
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.firstName+" "+item.userData.lastName}
                  </p>
                  <p className="text-gray-600">{item.slotDate}</p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-sm font-medium">Cancelled</p>
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
      </div>
    )
  );
};

export default DoctorDashboard;
