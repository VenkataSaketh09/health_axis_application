
import React, { useState, useEffect, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  Heart,
  Plus,
  TrendingUp,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Activity,
  Target
} from "lucide-react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

const PulseRateMonitor = () => {
  const [readings, setReadings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    pulse: "",
    activity: "",
    notes: "",
  });

  const [showForm, setShowForm] = useState(false);

  const { token, backend_url, userData } = useContext(AppContext);

  const activityOptions = [
    { value: "resting", label: "Resting" },
    { value: "light_exercise", label: "Light Exercise" },
    { value: "moderate_exercise", label: "Moderate Exercise" },
    { value: "intense_exercise", label: "Intense Exercise" },
    { value: "after_meal", label: "After Meal" },
    { value: "stressed", label: "Stressed" },
    { value: "relaxed", label: "Relaxed" },
    { value: "morning", label: "Morning" },
    { value: "evening", label: "Evening" },
    { value: "other", label: "Other" }
  ];

  const fetchReadings = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${backend_url}/api/user/pulse-readings?page=${page}`,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setReadings(response.data.readings || response.data.data || []);
        setAnalytics(response.data.analytics || null);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.data.message || "Failed to fetch readings");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load readings");
      console.error("Fetch readings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const addReading = async (readingData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const {data}= await axios.post(
        `${backend_url}/api/user/pulse-readings`,
        readingData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setSuccess("Reading added successfully!");
        setFormData({
          date: "",
          time: "",
          pulse: "",
          activity: "",
          notes: "",
        });
        setShowForm(false);
        await fetchReadings(currentPage);
      } else {
        setError(response.data.message || "Failed to add reading");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Network error. Please try again."
      );
      console.error("Add reading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateReading = async (id, readingData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const {data} = await axios.put(
        `${backend_url}/api/user/pulse-readings/${id}`,
        readingData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setSuccess("Reading updated successfully!");
        setFormData({
          date: "",
          time: "",
          pulse: "",
          activity: "",
          notes: "",
        });
        setShowForm(false);
        setEditingId(null);
        await fetchReadings(currentPage);
      } else {
        setError(data.message || "Failed to update reading");
      }
    } catch (err) {
      setError(
        err?.data?.message || "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.date && formData.pulse) {
      const readingData = {
        userId: userData._id || userData.id,
        date: formData.date,
        time: formData.time || undefined,
        pulse: parseInt(formData.pulse),
        activity: formData.activity || undefined,
        notes: formData.notes || undefined,
      };

      if (editingId) {
        updateReading(editingId, readingData);
      } else {
        addReading(readingData);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      date: "",
      time: "",
      pulse: "",
      activity: "",
      notes: "",
    });
  };

  const handleEdit = (reading) => {
    setEditingId(reading._id);
    setFormData({
      date: reading.date.split("T")[0],
      time: reading.time || "",
      pulse: reading.pulse.toString(),
      activity: reading.activity || "",
      notes: reading.notes || "",
    });
    setShowForm(true);
  };

  const deleteReading = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reading?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const {data} = await axios.delete(
        `${backend_url}/api/user/pulse-readings/${id}`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setSuccess("Reading deleted successfully!");
        await fetchReadings(currentPage);
      } else {
        setError(data.message || "Failed to delete reading");
      }
    } catch (err) {
      setError(err.data?.message || "Failed to delete reading");
    } finally {
      setLoading(false);
    }
  };

  const chartData = readings
    .map((reading) => ({
      date: new Date(reading.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      pulse: reading.pulse,
      activity: reading.activity,
      fullDate: reading.date,
      time: reading.time,
    }))
    .reverse();

  const getPulseCategory = (pulse) => {
    if (pulse < 60) return { category: "Bradycardia", color: "text-blue-600" };
    if (pulse <= 100) return { category: "Normal", color: "text-green-600" };
    if (pulse <= 120) return { category: "Elevated", color: "text-yellow-600" };
    return { category: "Tachycardia", color: "text-red-600" };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label} ${
            data.time ? `at ${data.time}` : ""
          }`}</p>
          <p className="text-red-500">{`Pulse: ${data.pulse} bpm`}</p>
          {data.activity && (
            <p className="text-blue-500">{`Activity: ${data.activity.replace('_', ' ')}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Pulse Rate Monitor
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchReadings(currentPage)}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Reading
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Average</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {analytics ? analytics.avgPulse : "--"}
            </p>
            <p className="text-sm text-blue-700">bpm</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Resting HR</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {analytics ? analytics.restingHeartRate : "--"}
            </p>
            <p className="text-sm text-green-700">bpm</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Range</h3>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {analytics ? `${analytics.minPulse}-${analytics.maxPulse}` : "--"}
            </p>
            <p className="text-sm text-purple-700">bpm</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Total Readings</h3>
            </div>
            <p className="text-2xl font-bold text-orange-900">
              {analytics ? analytics.totalReadings : 0}
            </p>
            <p className="text-sm text-orange-700">recorded</p>
          </div>
        </div>

        {/* Add/Edit Reading Form */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? "Edit Reading" : "Add New Reading"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    disabled={editingId}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    disabled={editingId}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pulse Rate (BPM) *
                  </label>
                  <input
                    type="number"
                    name="pulse"
                    value={formData.pulse}
                    onChange={handleInputChange}
                    placeholder="72"
                    required
                    min="30"
                    max="220"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity/Context
                  </label>
                  <select
                    name="activity"
                    value={formData.activity}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select activity...</option>
                    {activityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g., feeling tired, after coffee, etc."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Reading"
                      : "Save Reading"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Chart */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Pulse Rate Trends
          </h2>
          <div className="h-80 bg-white p-4 rounded-lg border border-gray-200">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    domain={["dataMin - 10", "dataMax + 10"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pulse"
                    stroke="#ef4444"
                    fill="#fecaca"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    name="Pulse Rate"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>
                    No readings yet. Add your first reading to see the chart.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Readings Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Readings
          </h2>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pulse Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {readings.length > 0 ? (
                  readings.map((reading) => {
                    const { category, color } = getPulseCategory(reading.pulse);
                    return (
                      <tr key={reading._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {new Date(reading.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {reading.time || "Not specified"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {reading.pulse} bpm
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${color}`}>
                            {category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">
                            {reading.activity ? reading.activity.replace('_', ' ') : "Not specified"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">
                            {reading.notes || "No notes"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(reading)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit reading"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteReading(reading._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete reading"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Activity className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No readings found</p>
                        <p className="text-sm">
                          {loading ? "Loading..." : "Add your first pulse reading to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  onClick={() => currentPage > 1 && fetchReadings(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => currentPage < totalPages && fetchReadings(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 10 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, analytics?.totalReadings || 0)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {analytics?.totalReadings || 0}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => currentPage > 1 && fetchReadings(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchReadings(pageNum)}
                          disabled={loading}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => currentPage < totalPages && fetchReadings(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Health Insights */}
        {analytics && analytics.totalReadings > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Health Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-2">Pulse Rate Status</h4>
                <div className="space-y-2">
                  {analytics.avgPulse < 60 && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Your average pulse is below normal range. Consider consulting a healthcare provider.</span>
                    </div>
                  )}
                  {analytics.avgPulse >= 60 && analytics.avgPulse <= 100 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Your average pulse is within the normal range. Keep up the good work!</span>
                    </div>
                  )}
                  {analytics.avgPulse > 100 && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Your average pulse is elevated. Monitor closely and consult healthcare provider if concerned.</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-2">Recommendations</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Take readings at consistent times daily</p>
                  <p>• Record activity context for better insights</p>
                  <p>• Monitor for patterns or unusual changes</p>
                  <p>• Share data with your healthcare provider</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Distribution Chart */}
        {analytics && analytics.activityDistribution && Object.keys(analytics.activityDistribution).length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Activity Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.activityDistribution).map(([activity, count]) => (
                <div key={activity} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {activity.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
                )}
      </div>
    </div>
  ); 
};

    

export default PulseRateMonitor;