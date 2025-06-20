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
} from "lucide-react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
const BloodPressureMonitor = () => {
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
    systolic: "",
    diastolic: "",
    pulse: "",
    notes: "",
  });

  const [showForm, setShowForm] = useState(false);

  const { token, backend_url, userData } = useContext(AppContext);

  const fetchReadings = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${backend_url}/api/user/bp-readings?page=${page}`,
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

  // Add this useEffect after your existing useEffects:
  useEffect(() => {
    fetchReadings();
  }, []);

  // Update the addReading function to refresh data after success:
  const addReading = async (readingData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${backend_url}/api/user/bp-readings`,
        readingData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setSuccess("Reading added successfully!");
        setFormData({
          date: "",
          time: "",
          systolic: "",
          diastolic: "",
          pulse: "",
          notes: "",
        });
        setShowForm(false);
        // Refresh the readings after successful add
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
      const response = await axios.put(
        `${backend_url}/api/user/bp-readings/${id}`,
        readingData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setSuccess("Reading updated successfully!");
        setFormData({
          date: "",
          time: "",
          systolic: "",
          diastolic: "",
          pulse: "",
          notes: "",
        });
        setShowForm(false);
        setEditingId(null);
        await fetchReadings(currentPage);
      } else {
        setError(response.data.message || "Failed to update reading");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Network error. Please try again."
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
    if (formData.date && formData.systolic && formData.diastolic) {
      const readingData = {
        userId: userData._id || userData.id,
        date: formData.date,
        time: formData.time || undefined,
        systolic: parseInt(formData.systolic),
        diastolic: parseInt(formData.diastolic),
        pulse: formData.pulse ? parseInt(formData.pulse) : undefined,
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
      systolic: "",
      diastolic: "",
      pulse: "",
      notes: "",
    });
  };

  // Add these functions after the cancelEdit function in your React component

  const handleEdit = (reading) => {
    setEditingId(reading._id);
    setFormData({
      date: reading.date.split("T")[0], // Format date for input
      time: reading.time || "",
      systolic: reading.systolic.toString(),
      diastolic: reading.diastolic.toString(),
      pulse: reading.pulse ? reading.pulse.toString() : "",
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
      const response = await axios.delete(
        `${backend_url}/api/user/bp-readings/${id}`,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setSuccess("Reading deleted successfully!");
        await fetchReadings(currentPage);
      } else {
        setError(response.data.message || "Failed to delete reading");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete reading");
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
      systolic: reading.systolic,
      diastolic: reading.diastolic,
      pulse: reading.pulse,
      fullDate: reading.date,
      time: reading.time,
    }))
    .reverse();

  const getBPCategory = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80)
      return { category: "Normal", color: "text-green-600" };
    if (systolic < 130 && diastolic < 80)
      return { category: "Elevated", color: "text-yellow-600" };
    if (systolic < 140 || diastolic < 90)
      return { category: "Stage 1 High", color: "text-orange-600" };
    if (systolic < 180 || diastolic < 120)
      return { category: "Stage 2 High", color: "text-red-600" };
    return { category: "Crisis", color: "text-red-800" };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label} ${
            data.time ? `at ${data.time}` : ""
          }`}</p>
          <p className="text-red-500">{`Systolic: ${data.systolic} mmHg`}</p>
          <p className="text-blue-500">{`Diastolic: ${data.diastolic} mmHg`}</p>
          {data.pulse && (
            <p className="text-purple-500">{`Pulse: ${data.pulse} bpm`}</p>
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
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Blood Pressure Monitor
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Average BP</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {analytics
                ? `${analytics.avgSystolic}/${analytics.avgDiastolic}`
                : "--/--"}
            </p>
            <p className="text-sm text-blue-700">mmHg</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Latest Reading</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {analytics && analytics.latestReading
                ? `${analytics.latestReading.systolic}/${analytics.latestReading.diastolic}`
                : "--/--"}
            </p>
            <p className="text-sm text-green-700">
              {analytics && analytics.latestReading
                ? new Date(analytics.latestReading.date).toLocaleDateString()
                : "No data"}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Total Readings</h3>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {analytics ? analytics.totalReadings : 0}
            </p>
            <p className="text-sm text-purple-700">recorded</p>
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
                    Systolic *
                  </label>
                  <input
                    type="number"
                    name="systolic"
                    value={formData.systolic}
                    onChange={handleInputChange}
                    placeholder="120"
                    required
                    min="70"
                    max="250"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diastolic *
                  </label>
                  <input
                    type="number"
                    name="diastolic"
                    value={formData.diastolic}
                    onChange={handleInputChange}
                    placeholder="80"
                    required
                    min="40"
                    max="150"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pulse (BPM)
                  </label>
                  <input
                    type="number"
                    name="pulse"
                    value={formData.pulse}
                    onChange={handleInputChange}
                    placeholder="72"
                    min="40"
                    max="200"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="e.g., after workout, before medication"
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
            Blood Pressure Trends
          </h2>
          <div className="h-80 bg-white p-4 rounded-lg border border-gray-200">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
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
                  <Line
                    type="monotone"
                    dataKey="systolic"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    name="Systolic"
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    name="Diastolic"
                  />
                  {chartData.some((d) => d.pulse) && (
                    <Line
                      type="monotone"
                      dataKey="pulse"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                      name="Pulse"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
                    BP Reading
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pulse
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
                {readings.map((reading) => {
                  const category = getBPCategory(
                    reading.systolic,
                    reading.diastolic
                  );
                  return (
                    <tr key={reading._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(reading.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.time || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {reading.systolic}/{reading.diastolic}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm font-medium ${category.color}`}
                      >
                        {category.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.pulse ? `${reading.pulse} bpm` : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {reading.notes || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(reading)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit reading"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteReading(reading._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete reading"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {readings.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No readings recorded yet. Click "Add Reading" to get started.
              </div>
            )}
            {loading && (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading readings...
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => fetchReadings(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => fetchReadings(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodPressureMonitor;
