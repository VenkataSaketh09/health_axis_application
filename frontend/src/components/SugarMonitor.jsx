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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  Plus,
  TrendingUp,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Droplets,
  Target,
} from "lucide-react";
import { AppContext } from "@/context/AppContext";
import axios from "axios";

const GlucoseMonitor = () => {
  const [readings, setReadings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  // const [filters, setFilters] = useState({
  //   category: "",
  //   readingType: "",
  //   startDate: "",
  //   endDate: "",
  // });

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    glucose: "",
    readingType: "",
    notes: "",
  });

  const [showForm, setShowForm] = useState(false);

  const { token, backend_url, userData } = useContext(AppContext);

  const readingTypes = [
    { value: "fasting", label: "Fasting" },
    { value: "before_meal", label: "Before Meal" },
    { value: "after_meal", label: "After Meal" },
    { value: "bedtime", label: "Bedtime" },
    { value: "random", label: "Random" },
  ];

  const categoryColors = {
    low: "#ef4444",
    normal: "#22c55e",
    prediabetic: "#f59e0b",
    diabetic: "#dc2626",
  };

  const fetchReadings = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${backend_url}/api/user/glucose-readings?page=${page}`,
        {
          headers: { token },
        }
      );

      // Access the actual API response
      const data = response.data;

      if (data.success) {
        setReadings(data.readings || []);
        setAnalytics(data.analytics || null);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || "Failed to fetch readings");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load readings");
      console.error("Fetch readings error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Fetch readings first (without overwriting analytics)
      await fetchReadings(currentPage);
      // Then fetch detailed analytics (this will include HbA1c)
      await fetchAnalytics();
      // Finally fetch trends
      await fetchTrends();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (days = 30) => {
    try {
      const { data } = await axios.get(
        `${backend_url}/api/user/glucose-analytics?days=${days}`,
        {
          headers: { token },
        }
      );

      console.log("Full API response:", data);

      if (data.success && data.analytics) {
        console.log("Setting analytics:", data.analytics);
        setAnalytics(data.analytics);

        // Force a small delay to ensure state update
        setTimeout(() => {
          console.log("Analytics state after update:", analytics);
        }, 100);
      } else {
        console.error("Analytics fetch failed:", data.message);
        setAnalytics(null);
      }
    } catch (err) {
      console.error("Fetch analytics error:", err);
      setAnalytics(null);
    }
  };

  const fetchTrends = async (days = 7, readingType = "") => {
    try {
      const params = new URLSearchParams({
        days: days.toString(),
        ...(readingType && { readingType }),
      });

      const data = await axios.get(
        `${backend_url}/api/user/glucose-trends?${params}`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setTrends(data.trendData);
      }
    } catch (err) {
      console.error("Fetch trends error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("useEffect: Starting data fetch");
      await fetchReadings();
      await fetchAnalytics();
      await fetchTrends();
      console.log("useEffect: Data fetch completed");
    };

    if (token && backend_url) {
      fetchData();
    }
  }, [token, backend_url]); // Add dependencies to ensure it runs when these change
  const addReading = async (readingData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post(
        `${backend_url}/api/user/glucose-readings`,
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
          glucose: "",
          readingType: "",
          notes: "",
        });
        setShowForm(false);
        await fetchReadings(currentPage);
        await fetchAnalytics();
        await fetchTrends();
      } else {
        setError(data.message || "Failed to add reading");
      }
    } catch (err) {
      setError(err.data?.data?.message || "Network error. Please try again.");
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
      const { data } = await axios.put(
        `${backend_url}/api/user/glucose-readings/${id}`,
        readingData,
        {
          headers: { token },
        }
      );

      // Fix: Access data.success directly since response is destructured
      if (data.success) {
        setSuccess("Reading updated successfully!");
        setFormData({
          date: "",
          time: "",
          glucose: "",
          readingType: "",
          notes: "",
        });
        setShowForm(false);
        setEditingId(null);
        await fetchReadings(currentPage);
        await fetchAnalytics();
        await fetchTrends();
      } else {
        setError(data.message || "Failed to update reading");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteReading = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reading?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.delete(
        `${backend_url}/api/user/glucose-readings/${id}`,
        {
          headers: { token },
        }
      );

      // Fix: Access data.success directly
      if (data.success) {
        setSuccess("Reading deleted successfully!");
        await fetchReadings(currentPage);
        await fetchAnalytics();
        await fetchTrends();
      } else {
        setError(data.message || "Failed to delete reading");
      }
    } catch (err) {
      setError(err.data?.message || "Failed to delete reading");
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
    if (formData.date && formData.glucose && formData.readingType) {
      const readingData = {
        userId: userData._id || userData.id,
        date: formData.date,
        time: formData.time || undefined,
        glucose: parseInt(formData.glucose),
        readingType: formData.readingType,
        notes: formData.notes || undefined,
      };

      if (editingId) {
        updateReading(editingId, readingData);
      } else {
        addReading(readingData);
      }
    }
  };

  const handleEdit = (reading) => {
    setEditingId(reading._id);
    setFormData({
      date: reading.date.split("T")[0],
      time: reading.time || "",
      glucose: reading.glucose.toString(),
      readingType: reading.readingType,
      notes: reading.notes || "",
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      date: "",
      time: "",
      glucose: "",
      readingType: "",
      notes: "",
    });
  };

  const getGlucoseCategory = (glucose, readingType) => {
    switch (readingType) {
      case "fasting":
      case "before_meal":
        if (glucose < 70)
          return { category: "Low", color: "text-red-600", bg: "bg-red-50" };
        if (glucose <= 99)
          return {
            category: "Normal",
            color: "text-green-600",
            bg: "bg-green-50",
          };
        if (glucose <= 125)
          return {
            category: "Prediabetic",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          };
        return {
          category: "Diabetic",
          color: "text-red-700",
          bg: "bg-red-100",
        };

      case "after_meal":
      case "random":
        if (glucose < 70)
          return { category: "Low", color: "text-red-600", bg: "bg-red-50" };
        if (glucose <= 139)
          return {
            category: "Normal",
            color: "text-green-600",
            bg: "bg-green-50",
          };
        if (glucose <= 199)
          return {
            category: "Prediabetic",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          };
        return {
          category: "Diabetic",
          color: "text-red-700",
          bg: "bg-red-100",
        };

      case "bedtime":
        if (glucose < 70)
          return { category: "Low", color: "text-red-600", bg: "bg-red-50" };
        if (glucose <= 120)
          return {
            category: "Normal",
            color: "text-green-600",
            bg: "bg-green-50",
          };
        if (glucose <= 160)
          return {
            category: "Prediabetic",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          };
        return {
          category: "Diabetic",
          color: "text-red-700",
          bg: "bg-red-100",
        };

      default:
        return {
          category: "Unknown",
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
    }
  };

  const chartData = readings
    .map((reading) => ({
      date: new Date(reading.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      glucose: reading.glucose,
      readingType: reading.readingType,
      category: reading.category,
      fullDate: reading.date,
      time: reading.time,
    }))
    .reverse();

  const pieData =
    analytics && analytics.categoryDistribution
      ? Object.entries(analytics.categoryDistribution).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value,
          color: categoryColors[key] || "#gray",
        }))
      : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{`${label} ${
            data.time ? `at ${data.time}` : ""
          }`}</p>
          <p className="text-blue-600">{`Glucose: ${data.glucose} mg/dL`}</p>
          <p className="text-gray-600">{`Type: ${data.readingType.replace(
            "_",
            " "
          )}`}</p>
          <p className="text-purple-600">{`Category: ${data.category}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Droplets className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Glucose Monitor
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
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
            <Droplets className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Average Glucose</h3>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {analytics ? analytics.avgGlucose : "--"}
            </p>
            <p className="text-sm text-blue-700">mg/dL</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Latest Reading</h3>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {analytics && analytics.latestReading
                ? analytics.latestReading.glucose
                : "--"}
            </p>
            <p className="text-sm text-green-700">
              {analytics && analytics.latestReading
                ? new Date(analytics.latestReading.date).toLocaleDateString()
                : "No data"}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Total Readings</h3>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {analytics ? analytics.totalReadings : 0}
            </p>
            <p className="text-sm text-purple-700">recorded</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Est. HbA1c</h3>
            </div>
            <p className="text-2xl font-bold text-orange-900">
              {analytics ? analytics.estimatedHbA1c : "-"}
            </p>
            <p className="text-sm text-orange-700">%</p>
          </div>
        </div>

        {/* Add/Edit Reading Form */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? "Edit Reading" : "Add New Reading"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    Glucose Level (mg/dL) *
                  </label>
                  <input
                    type="number"
                    name="glucose"
                    value={formData.glucose}
                    onChange={handleInputChange}
                    placeholder="100"
                    required
                    min="20"
                    max="600"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reading Type *
                  </label>
                  <select
                    name="readingType"
                    value={formData.readingType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    {readingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
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
                    placeholder="e.g., after workout, with medication"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-3 flex gap-3">
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line Chart */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Glucose Trends
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
                      domain={["dataMin - 20", "dataMax + 20"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      name="Glucose (mg/dL)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Droplets className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>
                      No readings yet. Add your first reading to see the chart.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Category Distribution
            </h2>
            <div className="h-80 bg-white p-4 rounded-lg border border-gray-200">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No category data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time in Range */}
        {analytics && analytics.timeInRange && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6 border border-indigo-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Time in Range
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {analytics.timeInRange.low}%
                </div>
                <div className="text-sm text-red-700">Below Target</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.timeInRange.normal}%
                </div>
                <div className="text-sm text-green-700">In Range</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {analytics.timeInRange.high}%
                </div>
                <div className="text-sm text-orange-700">Above Target</div>
              </div>
            </div>
          </div>
        )}

        {/* Readings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Readings
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Loading readings...</span>
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center py-12">
              <Droplets className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No readings found
              </h3>
              <p className="text-gray-500 mb-4">
                Start tracking your glucose levels by adding your first reading.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add First Reading
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Glucose Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reading Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {readings.map((reading) => {
                      const categoryInfo = getGlucoseCategory(
                        reading.glucose,
                        reading.readingType
                      );
                      return (
                        <tr key={reading._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {new Date(reading.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                                {reading.time && (
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {reading.time}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-semibold text-gray-900">
                              {reading.glucose}
                              <span className="text-sm text-gray-500 ml-1">
                                mg/dL
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 capitalize">
                              {reading.readingType.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.bg} ${categoryInfo.color}`}
                            >
                              {categoryInfo.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {reading.notes || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(reading)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                title="Edit reading"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteReading(reading._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
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
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        currentPage > 1 && fetchReadings(currentPage - 1)
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        currentPage < totalPages &&
                        fetchReadings(currentPage + 1)
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page{" "}
                        <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            currentPage > 1 && fetchReadings(currentPage - 1)
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {/* Page Numbers */}
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
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
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}

                        <button
                          onClick={() =>
                            currentPage < totalPages &&
                            fetchReadings(currentPage + 1)
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlucoseMonitor;
