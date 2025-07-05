import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";

const COLORS = ["#6366f1", "#f59e42", "#10b981", "#f43f5e", "#fbbf24"];

export default function FundCharts() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [navData, setNavData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setErr("");
    try {
      const [catRes, monthRes, navRes] = await Promise.all([
        axios.get("/api/fund/category"),
        axios.get("/api/fund/monthly"),
        axios.get("/api/fund/nav"),
      ]);
      setCategoryData(catRes.data);
      setMonthlyData(monthRes.data);
      setNavData(navRes.data);
    } catch (e) {
      setErr("Failed to load analytics data.");
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <span className="text-lg text-gray-500">Loading charts...</span>
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-full flex flex-col items-center py-12">
        <span className="text-red-500 mb-2">{err}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded shadow"
          onClick={fetchData}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
        <h2 className="font-semibold mb-2 text-center">Category Allocation</h2>
        {categoryData.length === 0 ? (
          <span className="text-gray-400">No data</span>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        <button
          className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={fetchData}
        >
          Refresh
        </button>
      </div>
      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
        <h2 className="font-semibold mb-2 text-center">Monthly Investments</h2>
        {monthlyData.length === 0 ? (
          <span className="text-gray-400">No data</span>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="investment" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        )}
        <button
          className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={fetchData}
        >
          Refresh
        </button>
      </div>
      {/* Line Chart */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
        <h2 className="font-semibold mb-2 text-center">NAV Trend</h2>
        {navData.length === 0 ? (
          <span className="text-gray-400">No data</span>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={navData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="nav" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        )}
        <button
          className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={fetchData}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}