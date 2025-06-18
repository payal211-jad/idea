import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/Register";
import IdeaList from "./components/IdeaList";
import IdeaForm from "./components/IdeaForm";
import Dashboard from "./page/Dashboard";
import YourIdeasPage from "./page/YourIdeasPage";
import Navbar from "./components/Navbar";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="container mx-auto p-4">
        <Routes>
             <Route path="/"  element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={ isLoggedIn ? (<Navigate to="/dashboard" replace />) : (<Login onLogin={handleLogin} />) } />
           <Route path="/register" element={ isLoggedIn ? (<Navigate to="/dashboard" replace />) : (<Register onRegisterSuccess={handleLogin} />) } />
           <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}/>
          <Route path="/idealist" element={isLoggedIn ? <IdeaList /> : <Navigate to="/login" replace />}/>
          <Route path="/your-ideas" element={isLoggedIn ? <YourIdeasPage /> : <Navigate to="/login" replace />}/>
          <Route path="/your-ideas" element={isLoggedIn ? <YourIdeasPage /> : <Navigate to="/login" replace />}/>
          <Route  path="/ideaform" element={  isLoggedIn ? <IdeaForm /> : <Navigate to="/login" replace />   }  />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </div>
    </div>
  );
}
