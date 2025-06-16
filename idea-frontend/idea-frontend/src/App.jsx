import React, { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/Register";
import IdeaList from "./components/IdeaList";
import IdeaForm from "./components/IdeaForm";
import Dashboard from "./page/Dashboard";
import YourIdeasPage from "./page/YourIdeasPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-gray-300"
                >
                  Dashboard
                </Link>
                <Link to="/idealist" className="text-white hover:text-gray-300">
                  Browse Ideas
                </Link>
                <Link
                  to="/your-ideas"
                  className="text-white hover:text-gray-300"
                >
                  Your Ideas
                </Link>
              </>
            )}
          </div>
          <div>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                }}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-gray-300">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/idealist"
            element={
              isLoggedIn ? <IdeaList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/your-ideas"
            element={
              isLoggedIn ? <YourIdeasPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/ideaform"
            element={
              isLoggedIn ? <IdeaForm /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </div>
    </>
  );
}
