import React, { useEffect, useState } from "react";
import IdeaList from "../components/IdeaList";
import api from "../services/api";

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await api.get("/ideas");
        setIdeas(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load ideas");
        setLoading(false);
        console.error("Error fetching ideas:", err);
      }
    };

    fetchIdeas();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {" "}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* <IdeaList showAll={true} /> */}
    </div>
  );
}
