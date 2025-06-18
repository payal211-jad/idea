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

  if (loading) return <p className="text-center mt-6 text-gray-600">Loading ideas...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {ideas.length === 0 ? (
        <p className="text-center text-gray-600 mt-6">
          No ideas available yet.
        </p>
      ) : (
        <ul className="space-y-6">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-500"
            >
              <div className="p-6 flex flex-col sm:flex-row justify-between">
                <div className="flex-1 mb-4 sm:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800">{idea.title}</h3>
                  {idea.description && (
                    <p className="mt-2 text-gray-600">{idea.description}</p>
                  )}
                
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Author <span className="font-medium">{idea.author || "Unknown"}</span></p>
                  <p className="mt-1">{new Date(idea.created_at).toLocaleString()}</p>
                  <p className="mt-3 text-sm text-blue-600 font-small">
                    <span className="text-size-10 ">{idea.status==="completed"?<p className="text-green-500">{idea.status.toUpperCase()}</p>:idea.status==="pending"?<p className="text-red-500">{idea.status.toUpperCase()}</p>:<p className="text-blue-500">{idea.status.toUpperCase()}</p>}</span>
          
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
