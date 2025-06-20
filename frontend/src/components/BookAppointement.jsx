import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookAppointement = ({ doctor }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [slot, setSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { backend_url, token, getDoctorsData, userData } = useContext(AppContext);

  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);
    return day < today;
  };

  useEffect(() => {
    getTime();
    if (doctor && date) {
      getBookedSlots();
    }
  }, [doctor, date]);

  const getTime = () => {
    const timeList = [];
    for (let i = 10; i <= 12; i++) {
      timeList.push({ time: i + ":00 AM" });
      timeList.push({ time: i + ":30 AM" });
    }
    for (let i = 1; i <= 6; i++) {
      timeList.push({ time: i + ":00 PM" });
      timeList.push({ time: i + ":30 PM" });
    }
    setSlot(timeList);
  };

  const getBookedSlots = () => {
    if (!doctor || !date) return;
    
    // Format date to match your API format (assuming YYYY-MM-DD or similar)
    const formattedDate = date.toISOString().split('T')[0];
    
    // Get booked slots for the selected date from doctor's slots_booked
    const slotsForDate = doctor.slots_booked?.[formattedDate] || [];
    setBookedSlots(slotsForDate);
  };

  const formatDateForAPI = (date) => {
  // Use local date components to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }

    if (!date || !selectedTimeSlot) {
      toast.error("Please select both date and time slot");
      return;
    }

    // Get userId from userData
    const currentUserId = userData?._id || userData?.id;
    
    if (!doctor || !currentUserId) {
      toast.error("Missing required information. Please ensure you are logged in.");
      console.log("Debug - doctor:", doctor);
      console.log("Debug - userData:", userData);
      console.log("Debug - currentUserId:", currentUserId);
      return;
    }

    setIsLoading(true);

    try {
      const slotDate = formatDateForAPI(date);
      const slotTime = selectedTimeSlot;

      const requestData = {
        userId: currentUserId,
        doctorId: doctor._id,
        slotDate: slotDate,
        slotTime: slotTime
      };

      const { data } = await axios.post(
        backend_url + "/api/user/book-appointment", 
        requestData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment booked successfully Booked for " + formattedDate + " at " + slotTime);
        // Reset form
        setSelectedTimeSlot("");
        setDate(new Date());
        // Refresh doctor data to update booked slots
        if (getDoctorsData) {
          await getDoctorsData();
        }
        navigate('/my-appointments');
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error booking appointment: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const isSlotBooked = (timeSlot) => {
    return bookedSlots.includes(timeSlot);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
          Book Appointment
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Book Appointment</DialogTitle>
          <DialogDescription>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
                {/* Calendar */}
                <div className="flex flex-col gap-3 items-baseline">
                  <h2 className="flex gap-2 items-center">
                    <CalendarDays className="text-blue-600 h-5 w-5" />
                    Select Date
                  </h2>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        setSelectedTimeSlot(""); // Reset selected time when date changes
                      }
                    }}
                    disabled={isPastDay}
                    className="rounded-lg border text-gray-900"
                  />
                </div>

                {/* Time Slots */}
                <div className="mt-3 md:mt-0">
                  <h2 className="flex gap-2 items-center mb-3">
                    <Clock className="text-blue-600 h-5 w-5" />
                    Select Time Slot
                  </h2>
                  <div className="grid grid-cols-3 gap-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {slot?.map((value, index) => {
                      const isBooked = isSlotBooked(value.time);
                      return (
                        <h2
                          key={index}
                          onClick={() => !isBooked && setSelectedTimeSlot(value.time)}
                          className={`p-2 border rounded-full text-center text-xs cursor-pointer transition-colors ${
                            isBooked
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : value.time === selectedTimeSlot
                              ? "bg-blue-600 text-white"
                              : "text-gray-900 hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          {value.time}
                          {isBooked && <div className="text-xs text-red-500">Booked</div>}
                        </h2>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="sm:justify-end mt-4">
              <DialogClose asChild>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-900"
                    disabled={!(date && selectedTimeSlot) || isLoading}
                    onClick={bookAppointment}
                  >
                    {isLoading ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointement;