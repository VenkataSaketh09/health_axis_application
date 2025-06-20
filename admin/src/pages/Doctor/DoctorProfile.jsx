import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import {
  User,
  Edit3,
  Save,
  MapPin,
  IndianRupee,
  Stethoscope,
  Award,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backend_url } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [editableProfile, setEditableProfile] = useState(null);

  const handleButtonClick = () => {
    if (isEdit) {
      updateProfile();
    } else {
      setEditableProfile(profileData); // make a copy for editing
      setIsEdit(true);
    }
  };

  const updateProfile = async () => {
    try {
      const updatedData = {
        address: editableProfile.address,
        fees: editableProfile.fees,
        available: editableProfile.available,
      };
      const { data } = await axios.post(
        backend_url + "/api/doctor/update-profile",
        updatedData,
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 ml-11">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <img
                    src={profileData.image}
                    alt="Doctor Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="text-center md:text-left text-white flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {profileData.name}
                  </h1>
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                      <Award className="w-5 h-5" />
                      <span className="font-medium">
                        {profileData.degree} - {profileData.speciality}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">
                        {profileData.experience} Experience
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleButtonClick}
                    className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg"
                  >
                    {isEdit ? (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-5 h-5" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* About Section */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-6 h-6 text-blue-600" />
                      About Doctor
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.about}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                      Appointment Fee
                    </h3>
                    <div className="text-2xl font-bold text-green-600">
                      {currency}{" "}
                      {isEdit ? (
                        <input
                          type="number"
                          onChange={(e) =>
                            setEditableProfile({
                              ...editableProfile,
                              fees: e.target.value,
                            })
                          }
                          value={editableProfile?.fees}
                          className="inline-block w-32 px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-xl"
                        />
                      ) : (
                        profileData.fees
                      )}
                    </div>
                  </div>
                </div>

                {/* Address and Availability */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      Clinic Address
                    </h3>
                    {isEdit ? (
                      <textarea
                        value={editableProfile?.address}
                        onChange={(e) =>
                          setEditableProfile({
                            ...editableProfile,
                            address: e.target.value,
                          })
                        }
                        className="w-full p-4 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                        placeholder="Enter clinic address..."
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {profileData.address}
                      </p>
                    )}
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Availability Status
                    </h3>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div
                        className="relative"
                        onClick={() => {
                          if (isEdit) {
                            setEditableProfile((prev) => ({
                              ...prev,
                              available: !prev.available,
                            }));
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={editableProfile?.available}
                          readOnly
                          className="sr-only"
                        />
                        <div
                          className={`flex items-center gap-3 cursor-pointer ${
                            isEdit ? "" : "opacity-50 cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (isEdit) {
                              setEditableProfile((prev) => ({
                                ...prev,
                                available: !prev.available,
                              }));
                            }
                          }}
                        >
                          {editableProfile?.available ? (
                            <div className="text-green-600 flex items-center gap-2">
                              <CheckCircle className="w-6 h-6" />
                              <span>Available</span>
                            </div>
                          ) : (
                            <div className="text-gray-600 flex items-center gap-2">
                              <XCircle className="w-6 h-6" />
                              <span>Unavailable</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          editableProfile?.available
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {editableProfile?.available
                          ? "Available for Appointments"
                          : "Currently Unavailable"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
