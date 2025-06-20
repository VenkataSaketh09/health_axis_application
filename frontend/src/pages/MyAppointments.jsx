import React, { useState, useEffect, useContext, use } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const MyAppointments = () => {
  const { token, backend_url, userData, getDoctorsData } =
    useContext(AppContext);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data } = await axios.get(`${backend_url}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        console.log(data.appointments);
        setAppointments(data.appointments);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch appointments");
        setAppointments([]);
      }
    } catch (err) {
      setError("Error fetching appointments");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  // Helper function to check if appointment is upcoming or expired
  const isUpcoming = (appointmentDate, appointmentTime) => {
    // Add null/undefined checks
    if (!appointmentDate || !appointmentTime) {
      return false;
    }

    try {
      const now = new Date();

      // Handle date format: "2025-06-14" (YYYY-MM-DD)
      const dateParts = appointmentDate.split("-");
      if (dateParts.length !== 3) return false;

      const [year, month, day] = dateParts;

      const timeParts = appointmentTime.split(" ");
      if (timeParts.length !== 2) return false;

      const [time, period] = timeParts;

      const hourMinuteParts = time.split(":");
      if (hourMinuteParts.length !== 2) return false;

      const [hours, minutes] = hourMinuteParts;

      let hour24 = parseInt(hours);
      if (period === "PM" && hour24 !== 12) hour24 += 12;
      if (period === "AM" && hour24 === 12) hour24 = 0;

      const appointmentDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hour24,
        parseInt(minutes)
      );

      console.log("Comparing:", appointmentDateTime, "vs", now);
      return appointmentDateTime > now;
    } catch (error) {
      console.error("Error parsing appointment date/time:", error);
      return false;
    }
  };

  // Format date from API response - now handles slotDate format
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      // Handle YYYY-MM-DD format (slotDate)
      if (dateString.includes("-") && dateString.length === 10) {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year.slice(-2)}`;
      }

      // Handle timestamp format (date field)
      const date = new Date(parseInt(dateString));
      if (isNaN(date.getTime())) return "Invalid date";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  };

  // Filter appointments based on active tab
  const filteredAppointments =
    appointments?.filter((appointment) => {
      if (!appointment) return false;

      // Use slotDate and slotTime from your data structure
      const appointmentDate = appointment.slotDate;
      const appointmentTime = appointment.slotTime;

      console.log("Filtering appointment:", {
        slotDate: appointmentDate,
        slotTime: appointmentTime,
        cancelled: appointment.cancelled,
        isUpcoming: isUpcoming(appointmentDate, appointmentTime),
      });

      // If appointment is cancelled, it should always go to "past" tab
      if (appointment.cancelled) {
        return activeTab === "expired";
      }

      // For non-cancelled appointments, check if they're upcoming or past
      const isUpcomingAppt = isUpcoming(appointmentDate, appointmentTime);
      return activeTab === "upcoming" ? isUpcomingAppt : !isUpcomingAppt;
    }) || [];

  // Uncomment and fix this function when you need it
  const handleCancelAppointment = async (appointmentId) => {
    try {
      // Add your cancel endpoint here
      const { data } = await axios.post(
        `${backend_url}/api/user/cancel-appointment`,
        { appointmentId, userId: userData?._id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment Cancelled Successfully", {
          position: "top-right",
          style: {
            background: "#10b981",
            color: "white",
            border: "1px solid #059669",
            fontSize: "15px",
          },
          className: "toast-success",
          duration: 4000,
        });

        // Refresh appointments after cancellation
        fetchAppointments();
        getDoctorsData(); // Refresh doctors data

        // Automatically switch to past tab to show the cancelled appointment
        setActiveTab("expired");
      } else {
        toast.error("Failed to cancel appointment", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Cancel appointment error:", error);
      toast.error("Failed to cancel appointment", {
        position: "top-right",
      });
    }
  };

  const handlePayOnline = async (appointment) => {
    try {
      const { data } = await axios.post(
        `${backend_url}/api/user/pay-appointment`,
        { appointmentId: appointment._id, userId: userData?._id },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Payment Successful", {
          position: "top-right",
          style: {
            background: "#10b981",
            color: "white",
            border: "1px solid #059669",
            fontSize: "15px",
          },
          className: "toast-success",
          duration: 4000,
        });
        fetchAppointments(); // Refresh appointments
      } else {
        toast.error("Payment failed", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed", {
        position: "top-right",
      });
    }
  };

  const AppointmentCard = ({ appointment, showCancelButton = false }) => {
    if (!appointment) return null;

    // Use doctorData instead of doctorId based on your data structure
    const doctorData = appointment.doctorData;
    const formattedDate = formatDate(appointment.slotDate);

    return (
      <div className="bg-white rounded-lg border p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={doctorData?.image || assets.male}
                alt={doctorData?.name || "Doctor"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">
                {doctorData?.name || "Doctor Name"}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  {doctorData?.address || "Address not available"}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  Appointment On: {formattedDate}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  At Time: {appointment.slotTime || "Time not available"}
                </div>
                {appointment.amount && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="w-4 h-4 mr-2 text-blue-500">₹</span>
                    Fees: ₹{appointment.amount}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-10 mt-5 pb-5">
            {!appointment.cancelled &&
              (appointment.payment ? (
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 bg-green-50 px-6 cursor-default"
                  disabled
                >
                  Paid
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {!appointment.cancelled &&
                      activeTab === "upcoming" &&
                      (appointment.payment ? (
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-500 bg-green-50 px-6 cursor-default"
                          disabled
                        >
                          Paid
                        </Button>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-blue-500 text-blue-500 hover:bg-blue-100 px-6"
                            >
                              Pay Online
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Payment
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to proceed with the
                                payment of ₹{appointment.amount} for your
                                appointment with {appointment.doctorData?.name}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handlePayOnline(appointment)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Pay Now
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ))}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to proceed with the payment of ₹
                        {appointment.amount} for your appointment with{" "}
                        {appointment.doctorData?.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handlePayOnline(appointment)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Pay Now
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            {showCancelButton && !appointment.cancelled && !appointment.isCompleted && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-100 px-6"
                  >
                    Cancel Appointment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your appointment with{" "}
                      {doctorData?.name} scheduled for {formattedDate} at{" "}
                      {appointment.slotTime}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Cancel Appointment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {appointment.cancelled ? (
              <div className="text-red-600 text-md p-10 font-semibold">
                Appointment Cancelled
              </div>
            ) : (
              activeTab === "expired" && (
                <div className="text-green-600 text-md p-10 font-semibold">
                  Appointment Completed
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading appointments...</div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            Please log in to view your appointments
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("expired")}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "expired"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Past
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchAppointments}
            className="mt-2"
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Appointment Lists */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No {activeTab} appointments found
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              showCancelButton={activeTab === "upcoming"}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
