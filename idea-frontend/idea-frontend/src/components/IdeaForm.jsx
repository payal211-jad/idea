import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function IdeaForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ideaId = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchIdea() {
      if (!ideaId) return;

      setError("");
      setLoading(true);
      try {
        console.log("Fetching idea with ID:", ideaId);
        const res = await api.get(`/ideas/${ideaId}`);
        console.log("API Response:", res);

        if (res.data) {
          setFormData({
            title: res.data.title || "",
            description: res.data.description || "",
            status: res.data.status || "pending",
          });
        } else {
          setError("Failed to load idea: No data received");
          navigate("/your-ideas");
        }
      } catch (err) {
        console.error("Error loading idea:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to load idea";
        setError(`Error: ${errorMessage}`);
        // After 2 seconds, redirect back to your ideas
        setTimeout(() => navigate("/your-ideas"), 2000);
      } finally {
        setLoading(false);
      }
    }

    fetchIdea();
  }, [ideaId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (ideaId) {
        await api.put(`/ideas/${ideaId}`, formData);
      } else {
        await api.post("/ideas", formData);
      }
      navigate("/your-ideas");
    } catch (err) {
      console.error("Error saving idea:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to save idea";
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow mb-6 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">
          {ideaId ? "Edit Idea" : "Create New Idea"}
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-1">Title *</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter idea title"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded h-24 resize-none focus:outline-none focus:ring focus:ring-blue-200"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your idea..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Status</label>
          <select
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => navigate("/your-ideas")}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : ideaId ? "Update" : "Create"} Idea
          </button>
        </div>
      </form>
    </div>
  );
}
