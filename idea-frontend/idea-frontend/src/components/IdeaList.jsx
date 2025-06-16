import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function IdeaList() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIdeas() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/ideas/all");
        setIdeas(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching ideas:", err);
        setError("Failed to load ideas. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchIdeas();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading ideas...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {ideas.length === 0 ? (
        <p className="text-center text-gray-600 mt-6">
          No ideas available yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between gap-4 onhover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{idea.title}</h3>
                {idea.description && (
                  <p className="mt-1 text-gray-700">{idea.description}</p>
                )}
                <p className="mt-2 text-sm text-gray-500 italic">
                  Status: <span className="font-medium">{idea.status}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Posted by:{" "}
                  <span className="font-medium">
                    {idea.author || "Unknown"}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(idea.created_at).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
