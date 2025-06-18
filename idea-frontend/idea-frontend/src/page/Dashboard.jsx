import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import api from "../services/api";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { FaPlusCircle } from "react-icons/fa";
Chart.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [personalStats, setPersonalStats] = useState([]);
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [personalRes, allRes] = await Promise.all([
          api.get("/ideas/stats"),
          api.get("/ideas/stats/all"),
        ]);
        setPersonalStats(personalRes.data);
        setAllStats(allRes.data);
        setError("");
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load dashboard stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const getCountByStatus = (stats, status) =>
    stats.find((s) => s.status === status)?.count || 0;

  const createChartData = (stats, title) => ({
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: title,
        data: [
          getCountByStatus(stats, "pending"),
          getCountByStatus(stats, "in-progress"),
          getCountByStatus(stats, "completed"),
        ],
        backgroundColor: ["#60A5FA", "#FBBF24", "#34D399"],
      },
    ],
  });

  const personalTotal = personalStats.reduce((sum, s) => sum + s.count, 0);
  const allTotal = allStats.reduce((sum, s) => sum + s.count, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-65">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Ideas Dashboard</h2>
          <Link
            to="/ideaform"
            className="text-blue-600 hover:text-blue-800 transition flex items-center gap-2"
          >
            <FaPlusCircle size={18} />
            <span>Add New Idea</span>
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : personalTotal === 0 && allTotal === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No ideas have been created yet.
            </p>
            <button
              onClick={() => navigate("/ideaform")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Create the First Idea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                Your Ideas
              </h3>
              <div className="h-48 mb-3">
                <Pie
                  data={createChartData(personalStats, "Your Ideas")}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          boxWidth: 12,
                          padding: 8,
                          font: {
                            size: 11,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-xs text-gray-600">Your Total Ideas</p>
                  <p className="text-lg font-bold text-blue-700">
                    {personalTotal}
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-xs text-gray-600">Completion Rate</p>
                  <p className="text-lg font-bold text-blue-700">
                    {personalTotal
                      ? Math.round(
                          (getCountByStatus(personalStats, "completed") /
                            personalTotal) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* All Users Stats */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-purple-800">
                All Ideas
              </h3>
              <div className="h-48 mb-3">
                <Pie
                  data={createChartData(allStats, "All Ideas")}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          boxWidth: 12,
                          padding: 8,
                          font: {
                            size: 11,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-xs text-gray-600">Total Ideas</p>
                  <p className="text-lg font-bold text-purple-700">
                    {allTotal}
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-xs text-gray-600">
                    Overall Completion Rate
                  </p>
                  <p className="text-lg font-bold text-purple-700">
                    {allTotal
                      ? Math.round(
                          (getCountByStatus(allStats, "completed") / allTotal) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-3 gap-3">
                {["pending", "in-progress", "completed"].map((status) => (
                  <div
                    key={status}
                    className="bg-white p-3 rounded-lg shadow-sm"
                  >
                    <h4 className="text-sm font-semibold mb-2 capitalize">
                      {status.replace("-", " ")}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Your Ideas</p>
                        <p className="text-lg font-bold text-gray-800">
                          {getCountByStatus(personalStats, status)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">All Ideas</p>
                        <p className="text-lg font-bold text-gray-800">
                          {getCountByStatus(allStats, status)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
