import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { token, setToken, backend_url } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Account Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Personal Information
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",

    // Contact & Location
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Medical Information
    medicalConditions: "",
    allergies: "",
    medications: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    familyDoctor: "",

    // Consent & Agreement
    agreeTerms: false,
    agreePrivacy: false,
    healthNotifications: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempted with:", {
      email: formData.email,
      password: formData.password,
    });
    // Add your login logic here
    try {
      const { data } = await axios.post(`${backend_url}/api/user/login`, {
        email: formData?.email,
        password: formData?.password,
      });
      if (data.success) {
        toast.success(data.message);
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("An error occurred during the request: " + error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup attempted with:", formData);
    try {
      const { data } = await axios.post(
        `${backend_url}/api/user/register`,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred during the request: " + error.message);
    }
    // Add your signup logic here
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your healthcare account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      required
                    />
                  </div>

                  <Button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-800"
                  >
                    Sign In
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">
                      Don't have an account?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Create Account Here
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-center">
                  Join our healthcare platform for personalized medical care
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      🔐 Basic Account Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      🧍‍♂️ Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("bloodGroup", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="175"
                          value={formData.height}
                          onChange={(e) =>
                            handleInputChange("height", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          value={formData.weight}
                          onChange={(e) =>
                            handleInputChange("weight", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact & Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      📍 Contact & Location
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Street address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("country", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
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
                    </div>
                  </div>

                  <Separator />

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      🏥 Medical Information{" "}
                      <span className="text-sm font-normal text-gray-500">
                        (Optional)
                      </span>
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicalConditions">
                          Existing Medical Conditions
                        </Label>
                        <Textarea
                          id="medicalConditions"
                          placeholder="e.g., Diabetes, Hypertension, Asthma..."
                          value={formData.medicalConditions}
                          onChange={(e) =>
                            handleInputChange(
                              "medicalConditions",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                          id="allergies"
                          placeholder="e.g., Peanuts, Penicillin, Pollen..."
                          value={formData.allergies}
                          onChange={(e) =>
                            handleInputChange("allergies", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="medications">Current Medications</Label>
                        <Textarea
                          id="medications"
                          placeholder="List any medications you're currently taking..."
                          value={formData.medications}
                          onChange={(e) =>
                            handleInputChange("medications", e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactName">
                            Emergency Contact Name
                          </Label>
                          <Input
                            id="emergencyContactName"
                            placeholder="Contact person name"
                            value={formData.emergencyContactName}
                            onChange={(e) =>
                              handleInputChange(
                                "emergencyContactName",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactNumber">
                            Emergency Contact Number
                          </Label>
                          <Input
                            id="emergencyContactNumber"
                            type="tel"
                            placeholder="+1 (555) 987-6543"
                            value={formData.emergencyContactNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "emergencyContactNumber",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="familyDoctor">
                          Family Doctor / Physician
                        </Label>
                        <Input
                          id="familyDoctor"
                          placeholder="Dr. Smith, City General Hospital"
                          value={formData.familyDoctor}
                          onChange={(e) =>
                            handleInputChange("familyDoctor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Consent & Agreement */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      ✅ Consent & Agreement
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) =>
                            handleInputChange("agreeTerms", checked)
                          }
                          className="data-[state=checked]:bg-blue-500"
                          required
                        />
                        <Label htmlFor="agreeTerms" className="text-sm">
                          I agree to the{" "}
                          <span className="text-blue-600 hover:underline cursor-pointer">
                            Terms and Conditions
                          </span>{" "}
                          *
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreePrivacy"
                          checked={formData.agreePrivacy}
                          onCheckedChange={(checked) =>
                            handleInputChange("agreePrivacy", checked)
                          }
                          required
                          className="data-[state=checked]:bg-blue-500"
                        />
                        <Label htmlFor="agreePrivacy" className="text-sm">
                          I agree to the{" "}
                          <span className="text-blue-600 hover:underline cursor-pointer">
                            Privacy Policy
                          </span>{" "}
                          *
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="healthNotifications"
                          checked={formData.healthNotifications}
                          onCheckedChange={(checked) =>
                            handleInputChange("healthNotifications", checked)
                          }
                          className="data-[state=checked]:bg-blue-500"
                        />
                        <Label
                          htmlFor="healthNotifications"
                          className="text-sm"
                        >
                          I want to receive health notifications and newsletters
                          (Optional)
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSignup}
                    className="w-full bg-blue-600 hover:bg-blue-800"
                  >
                    Create Account
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">
                      Already have an account?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Login Here
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
