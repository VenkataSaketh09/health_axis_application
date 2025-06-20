import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Save,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const Myprofile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null); // Store original data for cancel functionality
  const navigate = useNavigate();
  const { userData, setUserData, token, loadUserprofileData, backend_url } =
    useContext(AppContext);
  // const [image, setImage] = useState(null);

  // Add loading state and provide default values
  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Add all user data to FormData (excluding image first)
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined) {
          let valueToSend = userData[key];

          // Convert dateOfBirth to YYYY-MM-DD format only
          if (key === "dateOfBirth") {
            valueToSend = new Date(userData[key]).toISOString().split("T")[0];
          }

          formData.append(key, valueToSend);
          console.log(`Adding ${key}:`, valueToSend);
        }
      });

      // Add image file separately if it exists and is a File object
      // if (image && image instanceof File) {
      //   console.log("Adding image file:", image.name, image.type, image.size);
      //   formData.append("image", image, image.name);
      // } else if (image) {
      //   console.warn("Image is not a File object:", typeof image, image);
      // }

      const response = await axios.post(
        `${backend_url}/api/user/update-profile`,
        formData,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");
        await loadUserprofileData();
        setIsEditing(false);
        // setImage(false);
        setOriginalData(null);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        "Error updating profile: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCancel = () => {
    // Restore original data if it was stored
    if (originalData) {
      setUserData(originalData);
    }
    setIsEditing(false);
    // setImage(false);
    setOriginalData(null);
  };

  const handleEditStart = () => {
    // Store original data before editing
    setOriginalData({ ...userData });
    setIsEditing(true);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatGender = (gender) => {
    const genderMap = {
      male: "Male",
      female: "Female",
      other: "Other",
      "prefer-not-to-say": "Prefer not to say",
    };
    return genderMap[gender] || gender || "Not specified";
  };

  const formatCountry = (country) => {
    const countryMap = {
      us: "United States",
      ca: "Canada",
      uk: "United Kingdom",
      au: "Australia",
      in: "India",
      other: "Other",
    };
    return countryMap[country] || country || "Not specified";
  };

  const handleHealthCardClick = (route) => {
    console.log(`Navigating to ${route}`);
    navigate(`/${route}`);
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     console.log("Selected file:", file.name, file.type, file.size);
  //     setImage(file); // This should be a File object
  //   }
  // };

  const healthCards = [
    {
      id: "bp",
      title: "Blood Pressure",
      route: "bp",
      imgSrc: assets.BP,
    },
    {
      id: "sugar",
      title: "Blood Sugar",
      route: "sugar",
      imgSrc: assets.sugar,
    },
    {
      id: "pulse",
      title: "Pulse Rate",
      route: "pulse",
      imgSrc: assets.pulse,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Profile Details */}
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <img
                          src={userData.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {userData.firstName || "First Name"}{" "}
                      {userData.lastName || "Last Name"}
                    </CardTitle>
                    <p className="text-gray-600">
                      {calculateAge(userData.dateOfBirth)} years old •{" "}
                      {formatGender(userData.gender)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEditStart}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">
                        Personal Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={userData.firstName || ""}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.firstName || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={userData.lastName || ""}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.lastName || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={
                              userData.dateOfBirth
                                ? new Date(userData.dateOfBirth)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              handleInputChange("dateOfBirth", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.dateOfBirth ? (
                              <>
                                {formatDate(userData.dateOfBirth)} (
                                {calculateAge(userData.dateOfBirth)} years)
                              </>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        {isEditing ? (
                          <Select
                            onValueChange={(value) =>
                              handleInputChange("gender", value)
                            }
                            value={userData.gender || ""}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {formatGender(userData.gender)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        {isEditing ? (
                          <Select
                            onValueChange={(value) =>
                              handleInputChange("bloodGroup", value)
                            }
                            value={userData.bloodGroup || ""}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.bloodGroup || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        {isEditing ? (
                          <Input
                            id="height"
                            type="number"
                            value={userData.height || ""}
                            onChange={(e) =>
                              handleInputChange("height", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.height
                              ? `${userData.height} cm`
                              : "Not provided"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        {isEditing ? (
                          <Input
                            id="weight"
                            type="number"
                            value={userData.weight || ""}
                            onChange={(e) =>
                              handleInputChange("weight", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.weight
                              ? `${userData.weight} kg`
                              : "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Contact Information Tab */}
                <TabsContent value="contact" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">
                        Contact Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={userData.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="flex-1"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-md flex-1">
                              {userData.email || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {isEditing ? (
                            <Input
                              id="phone"
                              type="tel"
                              value={userData.phone || ""}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className="flex-1"
                            />
                          ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-md flex-1">
                              {userData.phone || "Not provided"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          value={userData.address || ""}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          rows={2}
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">
                          {userData.address || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        {isEditing ? (
                          <Input
                            id="city"
                            value={userData.city || ""}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.city || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        {isEditing ? (
                          <Input
                            id="state"
                            value={userData.state || ""}
                            onChange={(e) =>
                              handleInputChange("state", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.state || "Not provided"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        {isEditing ? (
                          <Input
                            id="zipCode"
                            value={userData.zipCode || ""}
                            onChange={(e) =>
                              handleInputChange("zipCode", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.zipCode || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      {isEditing ? (
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("country", value)
                          }
                          value={userData.country || ""}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-md">
                          {formatCountry(userData.country)}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Medical Information Tab */}
                <TabsContent value="medical" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Heart className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-semibold">
                        Medical Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicalConditions">
                          Medical Conditions
                        </Label>
                        {isEditing ? (
                          <Textarea
                            id="medicalConditions"
                            value={userData.medicalConditions || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "medicalConditions",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md min-h-[80px]">
                            {userData.medicalConditions ||
                              "No medical conditions listed"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        {isEditing ? (
                          <Textarea
                            id="allergies"
                            value={userData.allergies || ""}
                            onChange={(e) =>
                              handleInputChange("allergies", e.target.value)
                            }
                            rows={2}
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.allergies || "No allergies listed"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="medications">Current Medications</Label>
                        {isEditing ? (
                          <Textarea
                            id="medications"
                            value={userData.medications || ""}
                            onChange={(e) =>
                              handleInputChange("medications", e.target.value)
                            }
                            rows={3}
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md min-h-[80px]">
                            {userData.medications || "No medications listed"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="familyDoctor">Family Doctor</Label>
                        {isEditing ? (
                          <Input
                            id="familyDoctor"
                            value={userData.familyDoctor || ""}
                            onChange={(e) =>
                              handleInputChange("familyDoctor", e.target.value)
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.familyDoctor || "No family doctor listed"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Emergency Contact Tab */}
                <TabsContent value="emergency" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-semibold">
                        Emergency Contact
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactName">
                          Emergency Contact Name
                        </Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContactName"
                            value={userData.emergencyContactName || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "emergencyContactName",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.emergencyContactName ||
                              "No emergency contact listed"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContactNumber">
                          Emergency Contact Number
                        </Label>
                        {isEditing ? (
                          <Input
                            id="emergencyContactNumber"
                            type="tel"
                            value={userData.emergencyContactNumber || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "emergencyContactNumber",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {userData.emergencyContactNumber ||
                              "No emergency contact number listed"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-orange-800">
                          Important Emergency Information
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-orange-700">
                            Blood Type:
                          </p>
                          <p className="text-orange-900">
                            {userData.bloodGroup || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-orange-700">
                            Key Allergies:
                          </p>
                          <p className="text-orange-900">
                            {userData.allergies || "None listed"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-orange-700">
                            Critical Medications:
                          </p>
                          <p className="text-orange-900">
                            {userData.medications || "None listed"}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-orange-700">
                            Medical Conditions:
                          </p>
                          <p className="text-orange-900">
                            {userData.medicalConditions || "None listed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Health Monitoring Cards */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Health Monitoring
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {healthCards.map((card) => (
                <Card
                  key={card.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-2 hover:border-blue-200"
                  onClick={() => handleHealthCardClick(card.route)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={card.imgSrc}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          // e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-blue-600" />
                      </div> */}
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      {card.title}
                    </h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
