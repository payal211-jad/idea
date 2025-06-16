import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function YourIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchYourIdeas() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/ideas");
        setIdeas(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching your ideas:", err);
        setError("Failed to load your ideas. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchYourIdeas();
  }, []);

  const deleteIdea = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this idea?")) return;

    try {
      await api.delete(`/ideas/${id}`);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Unable to delete idea.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/ideaform?id=${id}`);
  };

  if (loading) return <p className="text-center mt-6">Loading your ideas...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Ideas</h1>
        <button
          onClick={() => navigate("/ideaform")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Idea
        </button>
      </div>

      {ideas.length === 0 ? (
        <p className="text-center text-gray-600 mt-6">
          You haven't created any ideas yet. Click "Add New Idea" to get
          started!
        </p>
      ) : (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{idea.title}</h3>
                {idea.description && (
                  <p className="mt-1 text-gray-700">{idea.description}</p>
                )}
                <p className="mt-2 text-sm text-gray-500 italic">
                  Status: <span className="font-medium">{idea.status}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(idea.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 justify-end">
                <button
                  onClick={() => handleEdit(idea.id)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
